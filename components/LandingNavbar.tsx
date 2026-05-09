'use client';

import Link from 'next/link';

export default function LandingNavbar() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🏠</div>
            <h1 className="text-2xl font-bold">RoofScope AI</h1>
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-blue-200 transition-colors"
            >
              How It Works
            </button>
            <a
              href="https://github.com/yourusername/roofscope-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-200 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/app"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Try Product
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Made with Bob