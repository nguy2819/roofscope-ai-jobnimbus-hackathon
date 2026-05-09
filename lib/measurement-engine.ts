import { RoofType, MaterialType, RoofMeasurement, Estimate, LineItem, Address, MeasurementSource, JobType } from '@/types';
import { getSolarBuildingInsights, extractRoofArea, extractRoofSegmentCount, extractAveragePitch, extractImageryDate } from './google-solar';

// Sample measurement engine - deterministic calculations based on property characteristics
export class MeasurementEngine {
  private static readonly BASE_SQFT_MAP: Record<string, number> = {
    'thornton-co': 2450,
    'springfield-mo-canton': 1850,
    'houston-tx': 3200,
    'springfield-mo-rosebrier': 2100,
    'newport-news-va': 1650,
  };

  private static readonly PITCH_MAP: Record<RoofType, number> = {
    'gable': 6,
    'hip': 5,
    'flat': 1,
    'complex': 7,
    'not-sure': 5,
  };

  private static readonly PITCH_MULTIPLIER_MAP: Record<number, number> = {
    1: 1.00,  // flat
    2: 1.02,
    3: 1.03,
    4: 1.06,
    5: 1.08,
    6: 1.12,
    7: 1.16,
    8: 1.20,
    9: 1.25,
    10: 1.30,
    11: 1.36,
    12: 1.41,
  };

  private static readonly WASTE_MAP: Record<RoofType, number> = {
    'gable': 10,
    'hip': 12,
    'flat': 8,
    'complex': 15,
    'not-sure': 12,
  };

  private static readonly MATERIAL_COST_PER_SQUARE: Record<MaterialType, { min: number; max: number }> = {
    'asphalt': { min: 90, max: 150 },
    'metal': { min: 250, max: 450 },
    'tile': { min: 400, max: 700 },
    'membrane': { min: 150, max: 300 },
    'not-sure': { min: 100, max: 200 },
  };

  private static readonly LABOR_COST_PER_SQUARE: Record<MaterialType, { min: number; max: number }> = {
    'asphalt': { min: 60, max: 100 },
    'metal': { min: 150, max: 250 },
    'tile': { min: 200, max: 350 },
    'membrane': { min: 100, max: 180 },
    'not-sure': { min: 80, max: 150 },
  };

  static getAddressKey(address: Address): string {
    const normalized = address.full.toLowerCase();
    if (normalized.includes('thornton') && normalized.includes('co')) return 'thornton-co';
    if (normalized.includes('canton') && normalized.includes('springfield')) return 'springfield-mo-canton';
    if (normalized.includes('houston') && normalized.includes('tx')) return 'houston-tx';
    if (normalized.includes('rosebrier') && normalized.includes('springfield')) return 'springfield-mo-rosebrier';
    if (normalized.includes('newport news') && normalized.includes('va')) return 'newport-news-va';
    
    // Default calculation for unknown addresses
    return 'default';
  }

  static calculateBaseSqft(address: Address): number {
    const key = this.getAddressKey(address);
    return this.BASE_SQFT_MAP[key] || 2000; // Default 2000 sqft
  }

  static async calculateMeasurement(
    address: Address,
    roofType: RoofType,
    material: MaterialType
  ): Promise<RoofMeasurement> {
    let source: MeasurementSource = 'calibration-mode';
    let totalSqft: number | undefined;
    let pitch: number | undefined;
    let imageryDate: string | undefined;
    let segmentCount: number | undefined;

    // Try to get data from Google Solar API if coordinates are available
    if (address.lat && address.lng) {
      const solarResult = await getSolarBuildingInsights(address.lat, address.lng);
      
      if (solarResult.success && solarResult.data) {
        source = 'google-solar-api';
        
        // Extract roof area from API
        const apiRoofArea = extractRoofArea(solarResult.data);
        if (apiRoofArea) {
          totalSqft = apiRoofArea;
        }
        
        // Extract pitch from API
        const apiPitch = extractAveragePitch(solarResult.data);
        if (apiPitch) {
          pitch = apiPitch;
        }
        
        // Extract imagery date
        imageryDate = extractImageryDate(solarResult.data) || undefined;
        
        // Extract segment count
        segmentCount = extractRoofSegmentCount(solarResult.data) || undefined;
      }
    }

    // Fallback to calibration mode if API data not available
    if (!totalSqft || !pitch) {
      source = 'calibration-mode';
      const baseSqft = this.calculateBaseSqft(address);
      pitch = pitch || this.PITCH_MAP[roofType];
      const pitchMultiplier = this.PITCH_MULTIPLIER_MAP[pitch] || 1.08;
      totalSqft = totalSqft || Math.round(baseSqft * pitchMultiplier);
    }

    // Calculate derived values
    const pitchMultiplier = this.PITCH_MULTIPLIER_MAP[pitch] || 1.08;
    const wastePercent = this.WASTE_MAP[roofType];
    const squares = Math.round((totalSqft / 100) * 10) / 10;
    const wasteAdjustedSqft = Math.round(totalSqft * (1 + wastePercent / 100));
    
    // More realistic confidence based on source, roof type, and complexity
    let confidence: number;
    if (source === 'google-solar-api') {
      // Google Solar API provides good data, but still has limitations
      if (roofType === 'not-sure') {
        confidence = 0.75; // 75% - uncertain roof type
      } else if (roofType === 'complex') {
        confidence = 0.80; // 80% - complex geometry harder to measure
      } else {
        confidence = 0.85; // 85% - good satellite data with confirmed type
      }
    } else {
      // Calibration mode is less accurate
      if (roofType === 'not-sure') {
        confidence = 0.65; // 65% - sample logic + uncertain type
      } else if (roofType === 'complex') {
        confidence = 0.70; // 70% - sample logic + complex roof
      } else {
        confidence = 0.75; // 75% - sample logic with confirmed type
      }
    }

    return {
      totalSqft,
      squares,
      pitch,
      pitchMultiplier,
      wastePercent,
      wasteAdjustedSqft,
      confidence,
      source,
      imageryDate,
      segmentCount,
    };
  }

  static generateLineItems(
    measurement: RoofMeasurement,
    roofType: RoofType,
    jobType: JobType
  ): LineItem[] {
    const { totalSqft } = measurement;
    
    // Estimate linear feet for various components
    const perimeterFt = Math.round(Math.sqrt(totalSqft) * 4);
    const ridgeHipFt = roofType === 'hip' ? Math.round(perimeterFt * 0.6) : Math.round(perimeterFt * 0.3);
    const valleyFt = roofType === 'complex' ? Math.round(perimeterFt * 0.4) : Math.round(perimeterFt * 0.2);
    const eavesFt = perimeterFt;
    
    // Line items vary based on job type
    if (jobType === 'repair') {
      // Repair jobs have smaller scope
      return [
        {
          name: 'Leak Investigation & Diagnosis',
          quantity: '1',
          unit: 'service',
          priceRange: '$200-500',
        },
        {
          name: 'Localized Repair Area',
          quantity: '2-5',
          unit: 'squares',
          priceRange: '$150-300/sq',
        },
        {
          name: 'Flashing Repair/Replacement',
          quantity: '10-30',
          unit: 'linear ft',
          priceRange: '$15-35/ft',
        },
        {
          name: 'Sealant & Minor Repairs',
          quantity: '1',
          unit: 'service',
          priceRange: '$150-400',
        },
        {
          name: 'Moisture Testing',
          quantity: '1',
          unit: 'service',
          priceRange: '$100-250',
        },
      ];
    } else if (jobType === 'insurance-claim') {
      // Insurance claims include documentation
      return [
        {
          name: 'Storm Damage Assessment',
          quantity: '1',
          unit: 'service',
          priceRange: '$300-600',
        },
        {
          name: 'Roofing Material',
          quantity: `${measurement.squares}`,
          unit: 'squares',
          priceRange: 'See material estimate',
        },
        {
          name: 'Tear-off & Disposal',
          quantity: `${measurement.squares}`,
          unit: 'squares',
          priceRange: '$50-100/sq',
        },
        {
          name: 'Ridge/Hip Cap',
          quantity: `${ridgeHipFt}`,
          unit: 'linear ft',
          priceRange: '$3-8/ft',
        },
        {
          name: 'Valley Flashing',
          quantity: `${valleyFt}`,
          unit: 'linear ft',
          priceRange: '$8-15/ft',
        },
        {
          name: 'Underlayment',
          quantity: `${measurement.squares}`,
          unit: 'squares',
          priceRange: '$15-30/sq',
        },
        {
          name: 'Photo Documentation & Reporting',
          quantity: '1',
          unit: 'service',
          priceRange: '$200-400',
        },
      ];
    } else {
      // Full replacement
      return [
        {
          name: 'Roofing Material',
          quantity: `${measurement.squares}`,
          unit: 'squares',
          priceRange: 'See material estimate',
        },
        {
          name: 'Tear-off & Disposal',
          quantity: `${measurement.squares}`,
          unit: 'squares',
          priceRange: '$50-100/sq',
        },
        {
          name: 'Ridge/Hip Cap',
          quantity: `${ridgeHipFt}`,
          unit: 'linear ft',
          priceRange: '$3-8/ft',
        },
        {
          name: 'Valley Flashing',
          quantity: `${valleyFt}`,
          unit: 'linear ft',
          priceRange: '$8-15/ft',
        },
        {
          name: 'Eaves/Drip Edge',
          quantity: `${eavesFt}`,
          unit: 'linear ft',
          priceRange: '$2-5/ft',
        },
        {
          name: 'Underlayment',
          quantity: `${measurement.squares}`,
          unit: 'squares',
          priceRange: '$15-30/sq',
        },
        {
          name: 'Ventilation',
          quantity: '1',
          unit: 'system',
          priceRange: '$300-800',
        },
      ];
    }
  }

  static async generateEstimate(
    address: Address,
    roofType: RoofType,
    material: MaterialType,
    jobType: JobType
  ): Promise<Estimate> {
    const measurement = await this.calculateMeasurement(address, roofType, material);
    const lineItems = this.generateLineItems(measurement, roofType, jobType);
    
    const materialCost = this.MATERIAL_COST_PER_SQUARE[material];
    const laborCost = this.LABOR_COST_PER_SQUARE[material];
    
    const materialMin = Math.round(measurement.squares * materialCost.min);
    const materialMax = Math.round(measurement.squares * materialCost.max);
    const laborMin = Math.round(measurement.squares * laborCost.min);
    const laborMax = Math.round(measurement.squares * laborCost.max);
    const totalMin = materialMin + laborMin;
    const totalMax = materialMax + laborMax;
    
    const concerns = this.generateConcerns(roofType, material, measurement, jobType);
    const riskLevel = this.assessRiskLevel(roofType, measurement);
    const nextSteps = this.generateNextSteps(roofType, material, jobType);
    const contractorChecklist = this.generateContractorChecklist(roofType, jobType);
    const projectDuration = this.calculateProjectDuration(roofType, measurement, jobType);
    
    return {
      measurement,
      lineItems,
      materialCostRange: `$${materialMin.toLocaleString()} - $${materialMax.toLocaleString()}`,
      laborCostRange: `$${laborMin.toLocaleString()} - $${laborMax.toLocaleString()}`,
      totalCostRange: `$${totalMin.toLocaleString()} - $${totalMax.toLocaleString()}`,
      concerns,
      riskLevel,
      nextSteps,
      contractorChecklist,
      jobType,
      projectDuration,
    };
  }

  private static generateConcerns(
    roofType: RoofType,
    material: MaterialType,
    measurement: RoofMeasurement,
    jobType: JobType
  ): string[] {
    const concerns: string[] = [];
    
    // Job type specific concerns
    if (jobType === 'repair') {
      concerns.push('Leak source must be accurately identified before repair');
      concerns.push('Surrounding area condition should be assessed for hidden damage');
      concerns.push('Temporary repairs may be needed if weather delays permanent fix');
    } else if (jobType === 'insurance-claim') {
      concerns.push('Storm damage documentation must meet insurance requirements');
      concerns.push('Adjuster inspection timing may affect project schedule');
      concerns.push('Claim approval required before work can commence');
    }
    
    if (roofType === 'complex') {
      concerns.push('Complex roof geometry may require additional flashing and custom work');
      concerns.push('Multiple planes increase installation complexity and time');
    }
    
    if (roofType === 'flat') {
      concerns.push('Flat roofs require proper drainage system verification');
      concerns.push('Ponding water areas should be identified and addressed');
    }
    
    if (measurement.pitch >= 8) {
      concerns.push('Steep pitch may require additional safety equipment and labor');
      concerns.push('Access and material handling will be more challenging');
    }
    
    if (material === 'tile') {
      concerns.push('Tile roofing requires structural load verification');
      concerns.push('Specialized installation expertise required');
    }
    
    if (material === 'not-sure') {
      concerns.push('Material type should be confirmed for accurate pricing');
    }
    
    if (concerns.length === 0) {
      concerns.push('Standard installation expected with no major concerns identified');
    }
    
    return concerns;
  }

  private static assessRiskLevel(
    roofType: RoofType,
    measurement: RoofMeasurement
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    if (roofType === 'complex') riskScore += 2;
    if (roofType === 'not-sure') riskScore += 1;
    if (measurement.pitch >= 8) riskScore += 2;
    if (measurement.pitch >= 10) riskScore += 1;
    if (measurement.totalSqft > 3000) riskScore += 1;
    
    if (riskScore >= 4) return 'high';
    if (riskScore >= 2) return 'medium';
    return 'low';
  }

  private static generateNextSteps(roofType: RoofType, material: MaterialType, jobType: JobType): string[] {
    if (jobType === 'repair') {
      return [
        'Schedule leak investigation and moisture testing',
        'Identify exact source and extent of damage',
        'Provide detailed repair scope and pricing',
        'Schedule repair during favorable weather',
        'Conduct post-repair inspection and testing',
      ];
    } else if (jobType === 'insurance-claim') {
      return [
        'Document all storm damage with photos and measurements',
        'File insurance claim with detailed estimate',
        'Coordinate adjuster inspection',
        'Review claim settlement and negotiate if needed',
        'Schedule installation upon claim approval',
        'Provide final documentation to insurance company',
      ];
    } else {
      // Full replacement
      const steps = [
        'Schedule on-site inspection to verify measurements',
        'Confirm material selection and color preferences',
        'Review and sign detailed contract',
        'Obtain necessary permits',
        'Schedule installation with 2-week weather window',
      ];
      
      if (roofType === 'complex') {
        steps.splice(1, 0, 'Conduct detailed structural assessment');
      }
      
      if (material === 'tile' || material === 'metal') {
        steps.splice(2, 0, 'Verify structural capacity for material weight');
      }
      
      return steps;
    }
  }

  private static generateContractorChecklist(roofType: RoofType, jobType: JobType): string[] {
    if (jobType === 'repair') {
      return [
        'Conduct thorough leak investigation',
        'Test for moisture in decking and insulation',
        'Photograph all damage areas',
        'Identify matching materials for repair',
        'Check surrounding area for additional issues',
        'Plan for temporary weather protection if needed',
        'Verify warranty implications of repair',
      ];
    } else if (jobType === 'insurance-claim') {
      return [
        'Document all visible storm damage',
        'Take comprehensive photos from multiple angles',
        'Measure and map damaged areas',
        'Note wind damage, hail impacts, or debris strikes',
        'Check gutters, vents, and flashing for damage',
        'Prepare detailed scope of work for adjuster',
        'Coordinate adjuster meeting and walkthrough',
        'Provide supplemental documentation if needed',
      ];
    } else {
      // Full replacement
      const checklist = [
        'Verify all measurements with on-site inspection',
        'Check local building codes and permit requirements',
        'Inspect existing roof deck condition',
        'Assess ventilation adequacy',
        'Identify and plan for penetrations (vents, chimneys, skylights)',
        'Review access points and staging areas',
        'Confirm disposal method for old materials',
        'Verify insurance and warranty coverage',
      ];
      
      if (roofType === 'complex') {
        checklist.push('Map all roof planes and transitions');
        checklist.push('Plan custom flashing requirements');
      }
      
      return checklist;
    }
  }

  private static calculateProjectDuration(
    roofType: RoofType,
    measurement: RoofMeasurement,
    jobType: JobType
  ): string {
    if (jobType === 'repair') {
      return '1-2 days';
    } else if (jobType === 'insurance-claim') {
      // Insurance claims take longer due to approval process
      if (roofType === 'complex' || measurement.totalSqft > 3000) {
        return '6-10 days (including claim approval)';
      } else {
        return '4-7 days (including claim approval)';
      }
    } else {
      // Full replacement
      if (roofType === 'complex' || measurement.totalSqft > 3000) {
        return '5-8 days';
      } else if (roofType === 'flat') {
        return '3-5 days';
      } else if (measurement.totalSqft < 2000) {
        return '2-4 days';
      } else {
        return '3-6 days';
      }
    }
  }
}

// Made with Bob
