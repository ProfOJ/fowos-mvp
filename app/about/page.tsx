export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About FOWOS</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Future of Work Operating System - Connecting verified talent with employers through blockchain-powered
              credentials
            </p>
          </div>

          {/* What is FOWOS */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is FOWOS?</h2>
            <p className="text-lg text-gray-700 mb-6">
              FOWOS (Future of Work Operating System) is a revolutionary Web3-enabled talent marketplace that proves
              knowledge (POK) and skills (POS) through NFT credentials. We connect verified talent with employers
              through immutable blockchain records.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">For Talents</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Prove your knowledge through POK quizzes</li>
                  <li>• Demonstrate skills via POS projects</li>
                  <li>• Earn blockchain-verified NFT credentials</li>
                  <li>• Get discovered by top employers</li>
                  <li>• Build your reputation on-chain</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-600 mb-3">For Employers</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Find pre-verified talent</li>
                  <li>• Trust blockchain-backed credentials</li>
                  <li>• Hire with confidence</li>
                  <li>• Access global talent pool</li>
                  <li>• Reduce hiring time and costs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Sign Up & Verify</h3>
                <p className="text-gray-600">Create your profile and connect your Web3 wallet to get started</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Prove Your Skills</h3>
                <p className="text-gray-600">Take POK quizzes and complete POS projects to earn NFT credentials</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Hired</h3>
                <p className="text-gray-600">Showcase your verified credentials and connect with employers</p>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Blockchain & Web3</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Polygon/Base for fast, low-cost transactions</li>
                  <li>• Story Protocol for immutable POK records</li>
                  <li>• Web3Auth for seamless wallet integration</li>
                  <li>• Smart contracts for credential verification</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform & AI</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Next.js for modern web experience</li>
                  <li>• Supabase for real-time data</li>
                  <li>• Gemini AI for dynamic quiz generation</li>
                  <li>• Advanced security measures</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the future of work and start building your verified reputation today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up as Talent
              </a>
              <a
                href="/auth/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign Up as Employer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
