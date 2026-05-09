import { Estimate, Address, RoofType, MaterialType, JobType } from '@/types';
import MeasurementSourceBadge from './MeasurementSourceBadge';

interface EstimateReportProps {
  estimate: Estimate;
  address: Address;
  roofType: RoofType;
  material: MaterialType;
  jobType: JobType;
  onBack: () => void;
}

export default function EstimateReport({ estimate, address, roofType, material, jobType, onBack }: EstimateReportProps) {
  const { measurement, lineItems, materialCostRange, laborCostRange, totalCostRange, concerns, riskLevel, nextSteps, contractorChecklist, projectDuration } = estimate;

  const riskColors = {
    low: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    high: 'bg-red-100 text-red-800 border-red-300',
  };

  const riskIcons = {
    low: '✅',
    medium: '⚠️',
    high: '🚨',
  };

  const jobTypeLabels: Record<JobType, string> = {
    'full-replacement': 'Full Replacement',
    'repair': 'Repair / Leak Investigation',
    'insurance-claim': 'Insurance Claim',
  };

  const getConfidenceLabel = (confidence: number): string => {
    const percent = Math.round(confidence * 100);
    if (percent >= 85) return 'High confidence';
    if (percent >= 75) return 'Moderate confidence';
    return 'Estimated confidence';
  };

  const getConfidenceDescription = (confidence: number, source: string): string => {
    const percent = Math.round(confidence * 100);
    if (source === 'google-solar-api') {
      return `${percent}% - Based on satellite imagery. Confidence depends on roof complexity and imagery quality.`;
    } else {
      return `${percent}% - Based on calibration mode. On-site inspection recommended for verification.`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">📊 Roof Estimate Report</h2>
            <p className="text-blue-100 text-sm">{address.full}</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors"
          >
            ← Back
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-blue-200 mb-1">Job Type</p>
            <p className="font-bold text-sm">{jobTypeLabels[jobType]}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-blue-200 mb-1">Roof Type</p>
            <p className="font-bold text-sm">{roofType.charAt(0).toUpperCase() + roofType.slice(1)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-blue-200 mb-1">Material</p>
            <p className="font-bold text-sm">{material.charAt(0).toUpperCase() + material.slice(1)}</p>
          </div>
        </div>
      </div>

      {/* Measurement Source Badge */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Data Source</h3>
        <MeasurementSourceBadge
          source={measurement.source}
          imageryDate={measurement.imageryDate}
        />
        {measurement.segmentCount && (
          <p className="mt-3 text-sm text-gray-600">
            Roof segments detected: <strong>{measurement.segmentCount}</strong>
          </p>
        )}
      </div>

      {/* User-Confirmed Assumptions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          ✓ User-Confirmed Assumptions
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-purple-600 text-xl">📋</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Job Type: {jobTypeLabels[jobType]}</p>
              <p className="text-sm text-gray-600 mt-1">User-selected based on project needs</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-purple-600 text-xl">🏠</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Roof Type: {roofType === 'not-sure' ? 'To be determined' : roofType.charAt(0).toUpperCase() + roofType.slice(1)}</p>
              <p className="text-sm text-gray-600 mt-1">{roofType === 'not-sure' ? 'Will be confirmed during on-site inspection' : 'User-selected visual match'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="text-purple-600 text-xl">🧱</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Material: {material === 'not-sure' ? 'To be determined' : material.charAt(0).toUpperCase() + material.slice(1)}</p>
              <p className="text-sm text-gray-600 mt-1">{material === 'not-sure' ? 'Will be confirmed during on-site inspection' : 'User-confirmed selection'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Measurement Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          📏 Measurement Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Total Roof Area</p>
            <p className="text-2xl font-bold text-blue-700">{measurement.totalSqft.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              square feet
              {measurement.source === 'google-solar-api' ? ' (from satellite data)' : ' (estimated)'}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Roofing Squares</p>
            <p className="text-2xl font-bold text-blue-700">{measurement.squares}</p>
            <p className="text-xs text-gray-500">squares (100 sqft)</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Estimated Pitch</p>
            <p className="text-2xl font-bold text-blue-700">{measurement.pitch}/12</p>
            <p className="text-xs text-gray-500">pitch ratio</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">{getConfidenceLabel(measurement.confidence)}</p>
            <p className="text-2xl font-bold text-blue-700">{Math.round(measurement.confidence * 100)}%</p>
            <p className="text-xs text-gray-500">estimated accuracy</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Confidence Note:</strong> {getConfidenceDescription(measurement.confidence, measurement.source)}
          </p>
        </div>
      </div>

      {/* Why This Estimate? */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          💡 Why This Estimate?
        </h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">Data Source & Context</p>
            <p className="text-gray-700">
              {measurement.source === 'google-solar-api'
                ? `Measurements derived from Google Solar API satellite imagery${measurement.imageryDate ? ` (captured ${measurement.imageryDate})` : ''}. This provides accurate roof area and pitch data from high-resolution aerial photography.`
                : 'Measurements calculated using calibration mode with property-based estimates. This is a sample calculation for demonstration purposes.'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">Roof Complexity Assumptions</p>
            <p className="text-gray-700">
              Roof classified as <strong>{roofType}</strong> type. This affects the pitch multiplier ({measurement.pitchMultiplier.toFixed(2)}x) and waste percentage ({measurement.wastePercent}%) used in calculations.
              {roofType === 'complex' && ' Complex roofs require additional material for multiple planes and transitions.'}
              {roofType === 'flat' && ' Flat roofs have minimal pitch but require proper drainage considerations.'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">Material Selection Impact</p>
            <p className="text-gray-700">
              Selected material: <strong>{material}</strong>. Material choice significantly impacts both cost and installation complexity.
              {material === 'asphalt' && ' Asphalt shingles are the most common and cost-effective option.'}
              {material === 'metal' && ' Metal roofing offers superior durability and longevity.'}
              {material === 'tile' && ' Tile roofing provides premium aesthetics but requires structural verification.'}
              {material === 'membrane' && ' Membrane systems are ideal for flat or low-slope applications.'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">Job Type Workflow</p>
            <p className="text-gray-700">
              Selected job type: <strong>{jobTypeLabels[jobType]}</strong>.
              {jobType === 'full-replacement' && ' Full replacement includes complete tear-off, disposal, and new installation with all necessary components.'}
              {jobType === 'repair' && ' Repair work focuses on localized damage investigation and targeted fixes rather than full replacement.'}
              {jobType === 'insurance-claim' && ' Insurance claim workflow includes comprehensive damage documentation and coordination with adjusters.'}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">Calculation Logic</p>
            <p className="text-gray-700">
              Base area: {measurement.totalSqft.toLocaleString()} sqft →
              Pitch multiplier: {measurement.pitchMultiplier.toFixed(2)}x →
              Waste factor: +{measurement.wastePercent}% →
              Final area: {measurement.wasteAdjustedSqft.toLocaleString()} sqft ({measurement.squares} squares)
            </p>
          </div>
        </div>
      </div>

      {/* Project Duration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          ⏱️ Estimated Project Duration
        </h3>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border-2 border-green-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Expected Timeline</p>
              <p className="text-3xl font-bold text-green-700">{projectDuration}</p>
            </div>
            <span className="text-5xl">📅</span>
          </div>
          <p className="text-xs text-gray-600 mt-3">
            {jobType === 'repair' && 'Repair timeline depends on damage extent and weather conditions.'}
            {jobType === 'insurance-claim' && 'Timeline includes insurance approval process which can vary.'}
            {jobType === 'full-replacement' && 'Duration may vary based on weather, crew availability, and unforeseen conditions.'}
          </p>
        </div>
      </div>

      {/* Pitch & Complexity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          📐 Pitch & Complexity Assumptions
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-700">Pitch Multiplier</span>
            <span className="font-bold text-gray-900">{measurement.pitchMultiplier.toFixed(2)}x</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-700">Recommended Waste %</span>
            <span className="font-bold text-gray-900">{measurement.wastePercent}%</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700">Waste-Adjusted Area</span>
            <span className="font-bold text-gray-900">{measurement.wasteAdjustedSqft.toLocaleString()} sqft</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> {measurement.source === 'google-solar-api'
              ? 'Pitch values derived from satellite data. On-site inspection recommended for verification.'
              : 'These are estimated values based on roof type. On-site inspection will verify actual measurements.'}
          </p>
        </div>
      </div>

      {/* Cost Estimate */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          💰 Estimated Price Range
        </h3>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Material Cost</span>
              <span className="text-lg font-bold text-green-700">{materialCostRange}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Labor Cost</span>
              <span className="text-lg font-bold text-green-700">{laborCostRange}</span>
            </div>
            <div className="pt-3 mt-3 border-t-2 border-green-300">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-800">Total Project Cost</span>
                <span className="text-2xl font-bold text-green-800">{totalCostRange}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Price range includes materials, labor, and standard installation. Additional costs may apply for repairs, permits, or special requirements.
          </p>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          📋 Material & Line Item Estimate
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 text-gray-700 font-semibold">Item</th>
                <th className="text-right py-3 px-2 text-gray-700 font-semibold">Quantity</th>
                <th className="text-right py-3 px-2 text-gray-700 font-semibold">Unit</th>
                <th className="text-right py-3 px-2 text-gray-700 font-semibold">Price Range</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-800">{item.name}</td>
                  <td className="py-3 px-2 text-right text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-gray-600 text-xs">{item.unit}</td>
                  <td className="py-3 px-2 text-right font-semibold text-gray-800">{item.priceRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Risk Level */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {riskIcons[riskLevel]} Risk Assessment
        </h3>
        <div className={`rounded-lg p-4 border-2 ${riskColors[riskLevel]}`}>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Risk Level: {riskLevel.toUpperCase()}</span>
            <span className="text-3xl">{riskIcons[riskLevel]}</span>
          </div>
          <p className="text-sm mt-2">
            {riskLevel === 'low' && 'Standard installation expected with minimal complications.'}
            {riskLevel === 'medium' && 'Some complexity factors present. Additional planning recommended.'}
            {riskLevel === 'high' && 'Complex project requiring specialized expertise and careful planning.'}
          </p>
        </div>
      </div>

      {/* Roofing Concerns */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          ⚠️ Roofing Concerns & Considerations
        </h3>
        <ul className="space-y-2">
          {concerns.map((concern, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-orange-600 mt-0.5">•</span>
              <span className="text-sm text-gray-700 flex-1">{concern}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Customer Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          👤 Customer Summary
        </h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 mb-3">
            Based on our analysis of <strong>{address.full}</strong>, we {measurement.source === 'google-solar-api' ? 'measured' : 'estimate'} a {roofType} roof with approximately <strong>{measurement.totalSqft.toLocaleString()} square feet</strong> of roofing area.
          </p>
          <p className="text-gray-700 mb-3">
            For {material} roofing material, the estimated project cost ranges from <strong>{totalCostRange}</strong>, including materials, labor, and standard installation procedures.
          </p>
          <p className="text-gray-700">
            {measurement.source === 'google-solar-api'
              ? 'Roof area measured from Google Solar API satellite data. Material type and final measurements should be verified with an on-site inspection.'
              : 'This estimate uses sample calibration logic and should be verified with an on-site inspection for final accuracy.'}
          </p>
        </div>
      </div>

      {/* Insurance-Ready Notes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🛡️ Insurance-Ready Notes
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1">Property Information</p>
            <p>Address: {address.full}</p>
            <p>Roof Type: {roofType.charAt(0).toUpperCase() + roofType.slice(1)}</p>
            <p>Estimated Area: {measurement.totalSqft.toLocaleString()} sqft ({measurement.squares} squares)</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1">Scope of Work</p>
            <p>Complete roof replacement with {material} material</p>
            <p>Includes tear-off, disposal, underlayment, and all necessary flashing</p>
            <p>Estimated pitch: {measurement.pitch}/12 (multiplier: {measurement.pitchMultiplier}x)</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="font-semibold text-blue-900 mb-1">Cost Breakdown</p>
            <p>Material: {materialCostRange}</p>
            <p>Labor: {laborCostRange}</p>
            <p>Total: {totalCostRange}</p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          ✅ Suggested Next Steps
        </h3>
        <ol className="space-y-2">
          {nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </span>
              <span className="text-sm text-gray-700 flex-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contractor Checklist */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🔧 Contractor Checklist
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {contractorChecklist.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
              <input type="checkbox" className="mt-1" />
              <label className="text-sm text-gray-700 cursor-pointer">{item}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Limitations & Methodology */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-md p-6 border-2 border-purple-200">
        <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
          🔬 Data Source & Limitations
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          {measurement.source === 'google-solar-api' ? (
            <>
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="font-semibold text-green-900 mb-1">✓ Measurement Source: Google Solar API</p>
                <p>Roof area and pitch data derived from high-resolution satellite imagery.</p>
                {measurement.imageryDate && (
                  <p className="text-xs text-green-700 mt-1">Imagery Date: {measurement.imageryDate}</p>
                )}
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold text-yellow-900 mb-1">⚠️ Limitations:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800">
                  <li><strong>Material Type:</strong> Cannot be determined from satellite imagery. User confirmation required.</li>
                  <li><strong>Roof Type:</strong> Visual classification based on user selection, not automatically verified.</li>
                  <li><strong>Structural Condition:</strong> Satellite data does not reveal underlying deck condition or damage.</li>
                  <li><strong>Local Variations:</strong> Micro-level details may require on-site inspection.</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-semibold text-yellow-900 mb-1">⚙️ Calibration Mode - Sample Logic</p>
                <p>Using deterministic calculations based on property characteristics and roof type.</p>
                <p className="mt-2"><strong>Calculation Method:</strong> Base area × pitch multiplier × (1 + waste %) = Total roofing area</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                <p className="font-semibold text-orange-900 mb-1">⚠️ Important:</p>
                <p>This is a sample estimate for demonstration purposes. All measurements, material type, and roof type require verification with on-site inspection.</p>
              </div>
            </>
          )}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="font-semibold text-blue-900 mb-1">📊 Confidence Score: {Math.round(measurement.confidence * 100)}%</p>
            <p>Based on data source quality, information completeness, and roof complexity.</p>
          </div>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded">
            <p className="font-semibold text-purple-900 mb-1">🔌 Enhanced Data Sources (Future Integration):</p>
            <p className="text-xs">For production use, consider integrating with property-attribute data providers such as <strong>Vexcel</strong> or <strong>Nearmap</strong> for verified material type, roof age, and condition assessments.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
        >
          ← Back to Input
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          📄 Export Estimate PDF
        </button>
      </div>
    </div>
  );
}

// Made with Bob
