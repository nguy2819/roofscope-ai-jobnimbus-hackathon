/**
 * Google Solar API Integration
 * 
 * Provides real measurement data from Google's Solar API when available.
 * Falls back to calibration mode when API key is not configured.
 */

export interface SolarBuildingInsights {
  name: string;
  center: {
    latitude: number;
    longitude: number;
  };
  boundingBox?: {
    sw: { latitude: number; longitude: number };
    ne: { latitude: number; longitude: number };
  };
  imageryDate?: {
    year: number;
    month: number;
    day: number;
  };
  imageryProcessedDate?: {
    year: number;
    month: number;
    day: number;
  };
  postalCode?: string;
  administrativeArea?: string;
  statisticalArea?: string;
  regionCode?: string;
  solarPotential?: {
    maxArrayPanelsCount?: number;
    maxArrayAreaMeters2?: number;
    maxSunshineHoursPerYear?: number;
    carbonOffsetFactorKgPerMwh?: number;
    wholeRoofStats?: {
      areaMeters2?: number;
      sunshineQuantiles?: number[];
      groundAreaMeters2?: number;
    };
    roofSegmentStats?: Array<{
      pitchDegrees?: number;
      azimuthDegrees?: number;
      stats?: {
        areaMeters2?: number;
        sunshineQuantiles?: number[];
        groundAreaMeters2?: number;
      };
      center?: {
        latitude: number;
        longitude: number;
      };
      boundingBox?: {
        sw: { latitude: number; longitude: number };
        ne: { latitude: number; longitude: number };
      };
      planeHeightAtCenterMeters?: number;
    }>;
    panelCapacityWatts?: number;
    panelHeightMeters?: number;
    panelWidthMeters?: number;
    panelLifetimeYears?: number;
  };
  imageryQuality?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface GoogleSolarResult {
  success: boolean;
  data?: SolarBuildingInsights;
  error?: string;
  source: 'google-solar-api' | 'calibration-mode';
}

/**
 * Get building insights from Google Solar API
 * 
 * @param lat - Latitude of the property
 * @param lng - Longitude of the property
 * @returns Solar building insights or null if API key not configured
 */
export async function getSolarBuildingInsights(
  lat: number,
  lng: number
): Promise<GoogleSolarResult> {
  // Check for API key in environment variables
  const apiKey = 
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
    process.env.GOOGLE_SOLAR_API_KEY;

  // If no API key, return calibration mode
  if (!apiKey) {
    console.log('Google Solar API key not configured - using calibration mode');
    return {
      success: false,
      error: 'API key not configured',
      source: 'calibration-mode',
    };
  }

  try {
    // Google Solar API endpoint
    const url = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Solar API error:', response.status, errorText);
      
      return {
        success: false,
        error: `API error: ${response.status}`,
        source: 'calibration-mode',
      };
    }

    const data: SolarBuildingInsights = await response.json();

    return {
      success: true,
      data,
      source: 'google-solar-api',
    };
  } catch (error) {
    console.error('Error fetching Google Solar API data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      source: 'calibration-mode',
    };
  }
}

/**
 * Extract roof area from Solar API data (in square feet)
 */
export function extractRoofArea(data: SolarBuildingInsights): number | null {
  const areaMeters2 = data.solarPotential?.wholeRoofStats?.areaMeters2;
  if (!areaMeters2) return null;
  
  // Convert square meters to square feet (1 m² = 10.764 ft²)
  return Math.round(areaMeters2 * 10.764);
}

/**
 * Extract roof segment count from Solar API data
 */
export function extractRoofSegmentCount(data: SolarBuildingInsights): number | null {
  return data.solarPotential?.roofSegmentStats?.length || null;
}

/**
 * Extract average pitch from Solar API data (in 12-based format)
 */
export function extractAveragePitch(data: SolarBuildingInsights): number | null {
  const segments = data.solarPotential?.roofSegmentStats;
  if (!segments || segments.length === 0) return null;

  // Calculate weighted average pitch based on segment areas
  let totalArea = 0;
  let weightedPitchSum = 0;

  for (const segment of segments) {
    const pitchDegrees = segment.pitchDegrees;
    const areaMeters2 = segment.stats?.areaMeters2;

    if (pitchDegrees !== undefined && areaMeters2) {
      totalArea += areaMeters2;
      weightedPitchSum += pitchDegrees * areaMeters2;
    }
  }

  if (totalArea === 0) return null;

  const avgPitchDegrees = weightedPitchSum / totalArea;
  
  // Convert degrees to 12-based pitch (rise over 12 inches of run)
  // pitch = tan(degrees) * 12
  const pitchRatio = Math.tan(avgPitchDegrees * (Math.PI / 180)) * 12;
  
  return Math.round(pitchRatio);
}

/**
 * Get imagery date from Solar API data
 */
export function extractImageryDate(data: SolarBuildingInsights): string | null {
  const date = data.imageryDate;
  if (!date) return null;
  
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
}

// Made with Bob