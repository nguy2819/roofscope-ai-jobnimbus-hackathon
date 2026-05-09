import { MeasurementSource } from '@/types';

interface MeasurementSourceBadgeProps {
  source: MeasurementSource;
  imageryDate?: string;
}

export default function MeasurementSourceBadge({ source, imageryDate }: MeasurementSourceBadgeProps) {
  if (source === 'google-solar-api') {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg">
        <span className="text-2xl">🛰️</span>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-green-800">Google Solar API</span>
          <span className="text-xs text-green-700">Real satellite measurement data</span>
          {imageryDate && (
            <span className="text-xs text-green-600">Imagery: {imageryDate}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border-2 border-yellow-400 rounded-lg">
      <span className="text-2xl">⚙️</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-yellow-800">Calibration Mode</span>
        <span className="text-xs text-yellow-700">Sample logic - requires verification</span>
      </div>
    </div>
  );
}

// Made with Bob