import { Address, RoofType } from '@/types';

interface MapPanelProps {
  address: Address | null;
  aerialImage: string | null;
  roofType: RoofType | null;
}

export default function MapPanel({ address, aerialImage, roofType }: MapPanelProps) {
  // Generate Google Maps embed URL
  const mapSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address.full)}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent("Lehi, UT")}&output=embed`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col sticky top-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">📍 Map / Aerial Context</h2>
        {address && (
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
            Calibration Mode
          </span>
        )}
      </div>
      
      <div className="flex-1 relative bg-gray-900 min-h-[600px]">
        {aerialImage ? (
          // User-uploaded image with overlay
          <div className="w-full h-full relative">
            <img
              src={aerialImage}
              alt="Uploaded aerial view"
              className="w-full h-full object-cover"
            />
            {/* Roof scan overlay */}
            {address && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Translucent roof outline */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {roofType === 'gable' && (
                      <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                        <polygon points="150,30 250,100 250,170 50,170 50,100" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                        <line x1="150" y1="30" x2="150" y2="170" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3" strokeDasharray="8,4"/>
                      </svg>
                    )}
                    {roofType === 'hip' && (
                      <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                        <polygon points="150,40 240,90 240,170 60,170 60,90" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                        <line x1="150" y1="40" x2="60" y2="90" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                        <line x1="150" y1="40" x2="240" y2="90" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                      </svg>
                    )}
                    {roofType === 'flat' && (
                      <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                        <rect x="60" y="70" width="180" height="100" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                      </svg>
                    )}
                    {roofType === 'complex' && (
                      <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                        <polygon points="120,30 200,70 260,70 260,170 40,170 40,110 80,110" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                        <line x1="120" y1="30" x2="120" y2="170" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                        <line x1="200" y1="70" x2="200" y2="170" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                      </svg>
                    )}
                    {(!roofType || roofType === 'not-sure') && (
                      <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                        <rect x="70" y="60" width="160" height="120" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="4" strokeDasharray="12,6"/>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Address label */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                  <p className="text-sm font-semibold text-gray-800">{address.full}</p>
                </div>

                {/* Ready to scan badge */}
                <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                  🛰️ Ready to scan roof
                </div>

                {/* Measurement confidence badge */}
                <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg">
                  ✓ Measurement Confidence: {roofType ? 'High' : 'Pending'}
                </div>
              </div>
            )}
          </div>
        ) : address ? (
          // Google Maps embed with overlay
          <div className="w-full h-full relative">
            <iframe
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
              title="Property location map"
            />
            
            {/* Roof scan overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Translucent roof outline */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {roofType === 'gable' && (
                    <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                      <polygon points="150,30 250,100 250,170 50,170 50,100" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                      <line x1="150" y1="30" x2="150" y2="170" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3" strokeDasharray="8,4"/>
                    </svg>
                  )}
                  {roofType === 'hip' && (
                    <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                      <polygon points="150,40 240,90 240,170 60,170 60,90" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                      <line x1="150" y1="40" x2="60" y2="90" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                      <line x1="150" y1="40" x2="240" y2="90" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                    </svg>
                  )}
                  {roofType === 'flat' && (
                    <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                      <rect x="60" y="70" width="180" height="100" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                    </svg>
                  )}
                  {roofType === 'complex' && (
                    <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                      <polygon points="120,30 200,70 260,70 260,170 40,170 40,110 80,110" fill="rgba(59, 130, 246, 0.3)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="4"/>
                      <line x1="120" y1="30" x2="120" y2="170" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                      <line x1="200" y1="70" x2="200" y2="170" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="3"/>
                    </svg>
                  )}
                  {(!roofType || roofType === 'not-sure') && (
                    <svg width="300" height="200" viewBox="0 0 300 200" className="drop-shadow-2xl">
                      <rect x="70" y="60" width="160" height="120" fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="4" strokeDasharray="12,6"/>
                    </svg>
                  )}
                </div>
              </div>

              {/* Address label */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-800">{address.full}</p>
              </div>

              {/* Ready to scan badge */}
              <div className="absolute top-4 right-4 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                🛰️ Ready to scan roof
              </div>

              {/* Measurement confidence badge */}
              <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg">
                ✓ Measurement Confidence: {roofType ? 'High' : 'Pending'}
              </div>
            </div>
          </div>
        ) : (
          // Default map view (Lehi, UT) - neutral context
          <div className="w-full h-full relative">
            <iframe
              src={mapSrc}
              className="w-full h-full border-0"
              loading="lazy"
              title="Default map location"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-8 text-center max-w-md">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter or select an address to begin roof scan</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Choose from sample addresses or type your own
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with calibration disclosure */}
      {address && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-4">
              <span>🗺️ Google Maps</span>
              <span>📏 Mock Measurements</span>
            </div>
            <span className="text-amber-600 font-semibold">⚠️ Calibration Mode - Sample Data</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
