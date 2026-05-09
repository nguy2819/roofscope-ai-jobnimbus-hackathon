import { RoofType } from '@/types';
import { useState } from 'react';

interface RoofTypeSelectorProps {
  selectedType: RoofType | null;
  onSelect: (type: RoofType) => void;
}

// Note: Roof type is user-confirmed or visually assumed
// Not automatically verified from satellite data

const roofTypes: { type: RoofType; label: string; image: string | null; description: string }[] = [
  {
    type: 'gable',
    label: 'Gable Roof',
    image: '/types/gableroof.png',
    description: 'Two sloping sides meeting at a ridge',
  },
  {
    type: 'hip',
    label: 'Hip Roof',
    image: '/types/hiproof.png',
    description: 'All sides slope downward to walls',
  },
  {
    type: 'flat',
    label: 'Flat / Low-Slope',
    image: '/types/flat-low-slope.webp',
    description: 'Nearly level or very low pitch',
  },
  {
    type: 'complex',
    label: 'Complex / Multi-Plane',
    image: '/types/complexroof.png',
    description: 'Multiple roof planes and angles',
  },
  {
    type: 'not-sure',
    label: 'Not Sure',
    image: null,
    description: 'Let us estimate for you',
  },
];

export default function RoofTypeSelector({ selectedType, onSelect }: RoofTypeSelectorProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (type: RoofType) => {
    setImageErrors(prev => new Set(prev).add(type));
  };

  return (
    <div>
      <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-800">
          <strong>👁️ Visual Confirmation:</strong> Roof type is based on visual inspection or user selection. Select the type that best matches the property.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {roofTypes.map(({ type, label, image, description }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedType === type
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col gap-2">
            {/* Image or fallback icon */}
            {image && !imageErrors.has(type) ? (
              <img
                src={image}
                alt={`${label} diagram`}
                className="w-full h-28 object-cover rounded-lg border border-gray-200"
                onError={() => handleImageError(type)}
              />
            ) : (
              <div className="w-full h-28 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                <span className="text-5xl">
                  {type === 'not-sure' ? '❓' : '🏠'}
                </span>
              </div>
            )}
            
            {/* Roof type info */}
            <div className="w-full text-center">
              <p className={`text-sm font-bold ${
                selectedType === type ? 'text-blue-700' : 'text-gray-800'
              }`}>
                {label}
              </p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
            
            {/* Selected indicator */}
            {selectedType === type && (
              <div className="w-full mt-2 pt-2 border-t border-blue-200">
                <span className="text-xs text-blue-600 font-semibold text-center block">✓ Selected</span>
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
