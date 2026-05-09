export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🏠</div>
            <h1 className="text-2xl font-bold">RoofScope AI</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <a href="#workflow" className="hover:text-blue-200 transition-colors">
              Workflow
            </a>
            <a href="#estimate" className="hover:text-blue-200 transition-colors">
              Estimate
            </a>
            <a href="#method" className="hover:text-blue-200 transition-colors">
              Method
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Made with Bob
