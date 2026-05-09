import { MaterialType } from '@/types';
import { useState } from 'react';

interface MaterialSelectorProps {
  selectedMaterial: MaterialType | null;
  onSelect: (material: MaterialType) => void;
}

// Note: Material selection requires user confirmation
// This is NOT auto-detected from satellite imagery

const materials: { type: MaterialType; label: string; image: string | null; description: string }[] = [
  {
    type: 'asphalt',
    label: 'Asphalt Shingles',
    image: '/materials/Asphalt-Shingles.jpg',
    description: 'Most common, cost-effective',
  },
  {
    type: 'metal',
    label: 'Metal',
    image: '/materials/MetalMaterialsHeader.png',
    description: 'Durable, long-lasting',
  },
  {
    type: 'tile',
    label: 'Tile',
    image: '/materials/mccoy-what-you-should-know-about-clay-tile-roofs.jpg',
    description: 'Clay or concrete, premium',
  },
  {
    type: 'membrane',
    label: 'Flat Membrane',
    image: '/materials/flat-roof-best-material.webp',
    description: 'TPO, EPDM, or PVC',
  },
  {
    type: 'not-sure',
    label: 'Not Sure',
    image: null,
    description: 'Let us estimate for you',
  },
];

export default function MaterialSelector({ selectedMaterial, onSelect }: MaterialSelectorProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (type: MaterialType) => {
    setImageErrors(prev => new Set(prev).add(type));
  };

  return (
    <div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>⚠️ User Confirmation Required:</strong> Material type cannot be determined from satellite imagery alone. Please select based on visual inspection or property records.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {materials.map(({ type, label, image, description }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedMaterial === type
              ? 'border-green-500 bg-green-50 shadow-lg scale-105'
              : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col gap-2">
            {/* Image or fallback icon */}
            {image && !imageErrors.has(type) ? (
              <img
                src={image}
                alt={`${label} roofing material`}
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
            
            {/* Material info */}
            <div className="w-full text-center">
              <p className={`text-sm font-bold ${
                selectedMaterial === type ? 'text-green-700' : 'text-gray-800'
              }`}>
                {label}
              </p>
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
            
            {/* Selected indicator */}
            {selectedMaterial === type && (
              <div className="w-full mt-2 pt-2 border-t border-green-200">
                <span className="text-xs text-green-600 font-semibold text-center block">✓ Selected</span>
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
