export type RoofType = 'gable' | 'hip' | 'flat' | 'complex' | 'not-sure';
export type MaterialType = 'asphalt' | 'metal' | 'tile' | 'membrane' | 'not-sure';
export type JobType = 'full-replacement' | 'repair' | 'insurance-claim';
export type MeasurementSource = 'google-solar-api' | 'calibration-mode';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  full: string;
  lat?: number;
  lng?: number;
}

export interface RoofMeasurement {
  totalSqft: number;
  squares: number;
  pitch: number;
  pitchMultiplier: number;
  wastePercent: number;
  wasteAdjustedSqft: number;
  confidence: number;
  source: MeasurementSource;
  imageryDate?: string;
  segmentCount?: number;
}

export interface LineItem {
  name: string;
  quantity: string;
  unit: string;
  priceRange: string;
}

export interface Estimate {
  measurement: RoofMeasurement;
  lineItems: LineItem[];
  materialCostRange: string;
  laborCostRange: string;
  totalCostRange: string;
  concerns: string[];
  riskLevel: 'low' | 'medium' | 'high';
  nextSteps: string[];
  contractorChecklist: string[];
  jobType: JobType;
  projectDuration: string;
}

export interface PropertyData {
  address: Address;
  roofType: RoofType;
  material: MaterialType;
  aerialImage?: string;
}

// Made with Bob
