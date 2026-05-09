import { JobType } from '@/types';

interface JobTypeSelectorProps {
  selectedJobType: JobType | null;
  onSelect: (jobType: JobType) => void;
}

const jobTypes: { type: JobType; label: string; icon: string; description: string }[] = [
  {
    type: 'full-replacement',
    label: 'Full Replacement',
    icon: '🏗️',
    description: 'Complete roof tear-off and replacement',
  },
  {
    type: 'repair',
    label: 'Repair / Leak Investigation',
    icon: '🔧',
    description: 'Localized repairs and leak detection',
  },
  {
    type: 'insurance-claim',
    label: 'Insurance Claim',
    icon: '🛡️',
    description: 'Storm damage and insurance documentation',
  },
];

export default function JobTypeSelector({ selectedJobType, onSelect }: JobTypeSelectorProps) {
  return (
    <div>
      <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
        <p className="text-xs text-indigo-800">
          <strong>📋 Job Type:</strong> Select the type of roofing work needed. This will customize the estimate and workflow.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {jobTypes.map(({ type, label, icon, description }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedJobType === type
                ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col gap-2">
              {/* Icon */}
              <div className="w-full flex justify-center">
                <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full border-2 border-indigo-300">
                  <span className="text-3xl">{icon}</span>
                </div>
              </div>
              
              {/* Job type info */}
              <div className="w-full text-center">
                <p className={`text-sm font-bold ${
                  selectedJobType === type ? 'text-indigo-700' : 'text-gray-800'
                }`}>
                  {label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
              </div>
              
              {/* Selected indicator */}
              {selectedJobType === type && (
                <div className="w-full mt-2 pt-2 border-t border-indigo-200">
                  <span className="text-xs text-indigo-600 font-semibold text-center block">✓ Selected</span>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Made with Bob