'use client';

import { useState, useRef } from 'react';
import { RoofType, MaterialType, Address, Estimate, JobType } from '@/types';
import { MeasurementEngine } from '@/lib/measurement-engine';
import AppNavbar from '@/components/AppNavbar';
import MapPanel from '@/components/MapPanel';
import AddressSearch from '@/components/AddressSearch';
import RoofTypeSelector from '@/components/RoofTypeSelector';
import MaterialSelector from '@/components/MaterialSelector';
import JobTypeSelector from '@/components/JobTypeSelector';
import EstimateReport from '@/components/EstimateReport';

export default function AppPage() {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [jobType, setJobType] = useState<JobType | null>(null);
  const [roofType, setRoofType] = useState<RoofType | null>(null);
  const [material, setMaterial] = useState<MaterialType | null>(null);
  const [aerialImage, setAerialImage] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddressSelect = (address: Address) => {
    console.log("Selected address:", address);
    setSelectedAddress(address);
    setShowEstimate(false);
    setEstimate(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAerialImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateEstimate = async () => {
    if (!selectedAddress || !jobType || !roofType || !material) {
      alert('Please select an address, job type, roof type, and material to generate an estimate.');
      return;
    }

    const generatedEstimate = await MeasurementEngine.generateEstimate(
      selectedAddress,
      roofType,
      material,
      jobType
    );
    
    setEstimate(generatedEstimate);
    setShowEstimate(true);
  };

  const canGenerateEstimate = selectedAddress && jobType && roofType && material;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Map View (55%) */}
          <MapPanel
            address={selectedAddress}
            aerialImage={aerialImage}
            roofType={roofType}
          />

          {/* Right Panel - Controls and Estimate (45%) */}
          <div className="flex flex-col gap-6 overflow-y-auto">
            {!showEstimate ? (
              <>
                {/* Address Search */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Property Address</h2>
                  <AddressSearch
                    onAddressSelect={handleAddressSelect}
                    selectedAddress={selectedAddress}
                  />

                  {/* Image Upload */}
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload Aerial Image (Optional)</h3>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors border border-gray-300"
                    >
                      📷 Upload Roof Image
                    </button>
                    {aerialImage && (
                      <p className="mt-2 text-xs text-green-600">✓ Image uploaded</p>
                    )}
                  </div>
                </div>

                {/* Job Type Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Job Type</h2>
                  <JobTypeSelector
                    selectedJobType={jobType}
                    onSelect={setJobType}
                  />
                </div>

                {/* Roof Type Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Roof Type</h2>
                  <RoofTypeSelector 
                    selectedType={roofType}
                    onSelect={setRoofType}
                  />
                </div>

                {/* Material Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Roofing Material</h2>
                  <MaterialSelector 
                    selectedMaterial={material}
                    onSelect={setMaterial}
                  />
                </div>

                {/* Generate Button */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <button
                    onClick={handleGenerateEstimate}
                    disabled={!canGenerateEstimate}
                    className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                      canGenerateEstimate
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canGenerateEstimate ? '🚀 Generate Estimate' : '⚠️ Complete All Fields Above'}
                  </button>
                  
                  {canGenerateEstimate && (
                    <p className="mt-3 text-xs text-gray-500 text-center">
                      Will attempt Google Solar API, fallback to calibration mode if unavailable
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Estimate Report */}
                {estimate && (
                  <EstimateReport
                    estimate={estimate}
                    address={selectedAddress!}
                    roofType={roofType!}
                    material={material!}
                    jobType={jobType!}
                    onBack={() => setShowEstimate(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Made with Bob
