# Google Solar API Integration

## Overview

RoofScope AI now supports integration with Google's Solar API for real satellite-based roof measurements. When configured, the app will automatically fetch accurate roof area, pitch, and segment data from Google's high-resolution satellite imagery.

## Features

### With Google Solar API (Configured)
- ✅ **Real roof area measurements** from satellite data
- ✅ **Accurate pitch calculations** based on 3D roof modeling
- ✅ **Roof segment detection** for complex roofs
- ✅ **Imagery date tracking** for data freshness
- ✅ **Higher confidence scores** (85-95%)

### Without Google Solar API (Calibration Mode)
- ⚙️ **Sample calculation logic** for demonstration
- ⚙️ **Deterministic estimates** based on property characteristics
- ⚙️ **Lower confidence scores** (75-90%)
- ⚙️ **Clear labeling** as "Calibration Mode"

## Configuration

### Step 1: Get a Google Cloud API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Solar API**
4. Create an API key in "Credentials"
5. Restrict the key to Solar API for security

### Step 2: Set Environment Variable

Create or update `.env.local` in the `roofscope-ai` directory:

```bash
# Option 1: Use NEXT_PUBLIC_ prefix (client-side accessible)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Option 2: Use GOOGLE_SOLAR_API_KEY (server-side only)
GOOGLE_SOLAR_API_KEY=your_api_key_here
```

**Note:** The `NEXT_PUBLIC_` prefix makes the key accessible in the browser. For production, consider using server-side API routes to protect your key.

### Step 3: Restart Development Server

```bash
npm run dev
```

## How It Works

### Data Flow

1. **User selects address** → Address includes lat/lng coordinates
2. **Generate estimate clicked** → System checks for API key
3. **If API key exists:**
   - Calls Google Solar API with coordinates
   - Extracts roof area, pitch, segments, imagery date
   - Uses real data for calculations
   - Shows "Google Solar API" badge
4. **If no API key:**
   - Falls back to calibration mode
   - Uses sample calculation logic
   - Shows "Calibration Mode" badge

### API Response Processing

The integration extracts:

- **Roof Area**: Converted from m² to ft²
- **Pitch**: Calculated from segment pitch degrees to 12-based ratio
- **Segments**: Count of detected roof planes
- **Imagery Date**: When satellite photos were taken

## Data Limitations

### What Google Solar API Provides
✅ Roof area measurements  
✅ Roof pitch/tilt data  
✅ Roof segment geometry  
✅ Imagery date and quality  

### What It Does NOT Provide
❌ **Roofing material type** (asphalt, metal, tile, etc.)  
❌ **Roof structural condition**  
❌ **Underlying deck condition**  
❌ **Age of roof**  
❌ **Existing damage assessment**  

### User Confirmation Required
- **Material Type**: Must be selected by user or confirmed via inspection
- **Roof Type**: Visual classification, not automatically verified
- **Condition**: Requires on-site inspection

## UI Indicators

### Measurement Source Badge

The app displays a clear badge indicating the data source:

**Google Solar API Mode:**
```
🛰️ Google Solar API
   Real satellite measurement data
   Imagery: 2024-03-15
```

**Calibration Mode:**
```
⚙️ Calibration Mode
   Sample logic - requires verification
```

### Report Sections

The estimate report includes:

1. **Data Source Badge** - Shows which mode is active
2. **Measurement Attribution** - Labels data as "from satellite data" or "estimated"
3. **Limitations Section** - Comprehensive disclosure of what data is/isn't verified
4. **Confidence Score** - Higher with real API data (85-95% vs 75-90%)

## Testing

### Test Addresses with Coordinates

All sample addresses now include lat/lng coordinates:

- **3561 E 102nd Ct, Thornton, CO** - (39.8864, -104.9378)
- **1612 S Canton Ave, Springfield, MO** - (37.1833, -93.2683)
- **6310 Laguna Bay Court, Houston, TX** - (29.8644, -95.5361)
- And more...

### Testing Without API Key

1. Don't set environment variable
2. Select any address
3. Generate estimate
4. Should see "Calibration Mode" badge
5. Report should indicate sample logic

### Testing With API Key

1. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
2. Restart dev server
3. Select address with coordinates
4. Generate estimate
5. Should see "Google Solar API" badge (if API returns data)
6. Report should show satellite-based measurements

## Cost Considerations

Google Solar API pricing (as of 2024):
- Check [Google Solar API Pricing](https://developers.google.com/maps/documentation/solar/usage-and-billing)
- Consider implementing caching for production
- Monitor API usage in Google Cloud Console

## Production Recommendations

### Security
- Use server-side API routes to protect API key
- Implement rate limiting
- Add request validation

### Caching
- Cache API responses by address
- Set appropriate TTL (e.g., 30-90 days)
- Reduce API costs

### Error Handling
- Graceful fallback to calibration mode
- User-friendly error messages
- Logging for debugging

### Enhanced Data Sources

For production, consider integrating:
- **Vexcel** - Property attribute data, roof age, material type
- **Nearmap** - High-resolution aerial imagery, change detection
- **EagleView** - Roof measurements, condition assessment

## Code Structure

### Key Files

- `lib/google-solar.ts` - API integration and data extraction
- `lib/measurement-engine.ts` - Measurement calculations with API fallback
- `components/MeasurementSourceBadge.tsx` - UI badge component
- `components/EstimateReport.tsx` - Report with data attribution
- `types/index.ts` - TypeScript types including MeasurementSource

### Type Definitions

```typescript
export type MeasurementSource = 'google-solar-api' | 'calibration-mode';

export interface RoofMeasurement {
  totalSqft: number;
  squares: number;
  pitch: number;
  pitchMultiplier: number;
  wastePercent: number;
  wasteAdjustedSqft: number;
  confidence: number;
  source: MeasurementSource;  // NEW
  imageryDate?: string;        // NEW
  segmentCount?: number;       // NEW
}
```

## Support

For issues or questions:
1. Check Google Solar API documentation
2. Verify API key configuration
3. Check browser console for errors
4. Review server logs for API responses

---

**Made with Bob** 🤖