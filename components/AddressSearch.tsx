import { useState, useEffect, useRef } from 'react';
import { Address } from '@/types';
import { SAMPLE_ADDRESSES, parseAddress, filterAddresses } from '@/lib/sample-addresses';

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void;
  selectedAddress: Address | null;
}

export default function AddressSearch({ onAddressSelect, selectedAddress }: AddressSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Address[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedAddress) {
      setInputValue(selectedAddress.full);
    }
  }, [selectedAddress]);

  useEffect(() => {
    // Show filtered suggestions as user types, or all sample addresses when empty
    if (inputValue.length > 0) {
      const filtered = filterAddresses(inputValue, SAMPLE_ADDRESSES);
      setSuggestions(filtered);
    } else {
      // Show all sample addresses when input is empty and focused
      setSuggestions(SAMPLE_ADDRESSES);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelectAddress = (address: Address) => {
    console.log("Clicked suggestion:", address);
    console.log("Calling onAddressSelect with:", address);
    setInputValue(address.full);
    onAddressSelect(address);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    // Show suggestions when focused, even if empty
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Close dropdown when focus is lost
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      const parsed = parseAddress(inputValue);
      onAddressSelect(parsed);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder="Enter property address..."
          className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-gray-800 placeholder-gray-400"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {/* Google Maps-style autocomplete dropdown */}
      {/* Future: Replace local suggestions with Google Places Autocomplete API */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
          <div className="py-1">
            {/* Header for sample addresses when input is empty */}
            {inputValue.length === 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Sample Test Addresses
              </div>
            )}
            
            {suggestions.map((addr, idx) => (
              <div
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectAddress(addr);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-start gap-3 group cursor-pointer"
              >
                {/* Location pin icon */}
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                
                {/* Address text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-gray-900">
                    {addr.street}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
