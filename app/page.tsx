'use client';

import Link from 'next/link';
import LandingNavbar from '@/components/LandingNavbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Roof Measurement & Estimate Workflow
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            Address in → estimate-ready roofing report out.
          </p>
          <Link
            href="/app"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Try RoofScope AI
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              The Problem
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">⏱️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Manual Measurements
                </h3>
                <p className="text-gray-600">
                  Roofing contractors waste hours on manual roof measurements, climbing ladders and taking notes.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Slow & Inconsistent
                </h3>
                <p className="text-gray-600">
                  Estimates are slow to produce and vary wildly between contractors, creating confusion.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">😤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Long Wait Times
                </h3>
                <p className="text-gray-600">
                  Homeowners wait days or weeks for quotes, delaying critical roofing decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              How It Works
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Search Property Address
                  </h3>
                  <p className="text-gray-600">
                    Enter any property address in the United States. Our system uses Google Maps to locate and display the property.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Review Aerial Context
                  </h3>
                  <p className="text-gray-600">
                    View satellite imagery of the property. Upload your own aerial photos if available for better accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirm Roof Type & Material
                  </h3>
                  <p className="text-gray-600">
                    Select the roof type (gable, hip, flat, complex) and roofing material (asphalt shingles, metal, tile, flat membrane).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Generate Estimate
                  </h3>
                  <p className="text-gray-600">
                    Our AI engine calculates roof measurements, material quantities, labor costs, and generates a comprehensive estimate.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  5
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Export Estimate PDF
                  </h3>
                  <p className="text-gray-600">
                    Download a professional PDF report with all measurements, costs, and project details ready to share with clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data & Method Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Data & Method
            </h2>
            <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Current MVP Approach
                </h3>
                <p className="text-gray-600">
                  This hackathon demo uses calibration logic and sample data to demonstrate the workflow. 
                  Measurements are calculated based on roof type complexity factors and industry-standard formulas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Aerial Context
                </h3>
                <p className="text-gray-600">
                  We use Google Maps Static API to display satellite imagery of properties, providing visual context for roof assessment.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Future Integrations
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Google Solar API:</strong> Precise roof measurements and solar panel placement data</li>
                  <li><strong>Nearmap/Vexcel:</strong> High-resolution aerial imagery for detailed roof analysis</li>
                  <li><strong>AI Computer Vision:</strong> Automated roof type and material detection</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  User Confirmation Required
                </h3>
                <p className="text-gray-600">
                  Roof type and material selections require manual confirmation to ensure accuracy. 
                  This human-in-the-loop approach maintains quality while leveraging AI efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Faster Quoting
                </h3>
                <p className="text-gray-600">
                  Generate professional estimates in minutes instead of hours or days. 
                  Respond to leads faster and close more deals.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Contractor Efficiency
                </h3>
                <p className="text-gray-600">
                  Eliminate manual measurements and calculations. 
                  Focus on customer relationships and project execution.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Insurance Workflows
                </h3>
                <p className="text-gray-600">
                  Streamline insurance claim estimates with consistent, 
                  documented measurements and professional reports.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-4xl mb-4">📏</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Estimate Consistency
                </h3>
                <p className="text-gray-600">
                  Standardized calculations ensure consistent pricing across your team. 
                  Build trust with transparent, repeatable estimates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Roofing Workflow?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Experience the future of roof estimation. No signup required for the demo.
          </p>
          <Link
            href="/app"
            className="inline-block bg-white text-blue-600 text-lg font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all"
          >
            Launch RoofScope AI
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Built for JobNimbus AI Hackathon 2026 · Created by Tien Nguyen Borland · <a href="mailto:borlandtien@gmail.com" className="hover:text-white transition-colors">borlandtien@gmail.com</a> · <a href="https://github.com/nguy2819" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Made with Bob
