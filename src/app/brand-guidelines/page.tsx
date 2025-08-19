export default function BrandGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-orange-800 bg-clip-text text-transparent mb-4">
            Auto Serve Brand Guidelines
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto">
            Modern sunset-inspired branding that blends professional blue trust with warm amber service tones - creating a smooth, contemporary automotive experience
          </p>
        </header>

        <div className="grid gap-12">
          {/* Color Palette Section */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-6">Sunset Blue Service Palette</h2>
            <p className="text-slate-600 mb-8">Refined color system balancing professional blues with subtle amber accents, designed for modern glass-morphism interfaces</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Primary Dashboard Colors */}
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-3 shadow-lg"></div>
                <h3 className="font-semibold text-slate-800">Primary Blue</h3>
                <p className="text-sm text-slate-600">#3B82F6</p>
                <p className="text-xs text-slate-500">Main CTAs, primary actions</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg mb-3 shadow-lg"></div>
                <h3 className="font-semibold text-slate-800">Amber Alert</h3>
                <p className="text-sm text-slate-600">#F59E0B</p>
                <p className="text-xs text-slate-500">Urgent alerts, warnings</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg mb-3 shadow-lg"></div>
                <h3 className="font-semibold text-slate-800">Service Blue</h3>
                <p className="text-sm text-slate-600">#60A5FA</p>
                <p className="text-xs text-slate-500">Status indicators, trust</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg mb-3 shadow-lg"></div>
                <h3 className="font-semibold text-slate-100">Professional Slate</h3>
                <p className="text-sm text-slate-600">#64748B</p>
                <p className="text-xs text-slate-500">Text, secondary elements</p>
              </div>
              
              {/* Background Gradients */}
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-blue-50 to-sky-100 rounded-lg mb-3 shadow-lg border border-blue-200/50"></div>
                <h3 className="font-semibold text-slate-800">Blue Background</h3>
                <p className="text-sm text-slate-600">blue-50 → sky-100</p>
                <p className="text-xs text-slate-500">Card backgrounds</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg mb-3 shadow-lg border border-amber-200/50"></div>
                <h3 className="font-semibold text-slate-800">Amber Background</h3>
                <p className="text-sm text-slate-600">amber-50 → orange-100</p>
                <p className="text-xs text-slate-500">Warm accents</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 rounded-lg mb-3 shadow-lg border border-blue-200/30"></div>
                <h3 className="font-semibold text-slate-800">Sunset Page</h3>
                <p className="text-sm text-slate-600">blue-50 → amber-100</p>
                <p className="text-xs text-slate-500">Main background</p>
              </div>
              <div className="text-center">
                <div className="w-full h-24 bg-white/90 backdrop-blur-sm rounded-lg mb-3 shadow-xl border border-blue-200/50"></div>
                <h3 className="font-semibold text-slate-800">Glass Cards</h3>
                <p className="text-sm text-slate-600">white/90 + blur</p>
                <p className="text-xs text-slate-500">Modern glass effect</p>
              </div>
            </div>
          </section>

          {/* Typography Section */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-6">Sunset Typography</h2>
            <p className="text-slate-600 mb-8">Modern, readable typography that combines professional blue trust with warm sunset accessibility</p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Service Headlines</h3>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">Premium Auto Service</h1>
                  <h2 className="text-3xl font-bold text-slate-700">Oil Change & Maintenance</h2>
                  <h3 className="text-2xl font-semibold text-blue-600">Brake Inspection Service</h3>
                  <h4 className="text-xl font-medium text-amber-600">Tire Rotation Available</h4>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Service Descriptions</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  <strong className="text-blue-700">Full-Service Oil Change:</strong> Our certified technicians provide comprehensive oil changes using premium synthetic oil. Service includes 21-point inspection, fluid top-off, and tire pressure check. Trust our 20+ years of automotive expertise.
                </p>
                <p className="text-slate-500 text-sm">
                  <strong className="text-amber-600">Service time:</strong> 30 minutes • <strong className="text-blue-600">Warranty:</strong> 6 months or 6,000 miles
                </p>
              </div>
            </div>
          </section>

          {/* Modern Glass Components */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-6">Modern Glass Components</h2>
            <p className="text-slate-600 mb-8">Glass-morphism UI components with refined blue-amber color palette for professional automotive interfaces</p>
            
            {/* Glass-morphism Design System */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-lg border border-blue-200/30">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Glass-morphism Design System</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600"><strong>Card Style:</strong> <code className="bg-slate-100 px-2 py-1 rounded text-xs">bg-white/90 backdrop-blur-sm</code></p>
                  <p className="text-sm text-slate-600"><strong>Shadows:</strong> <code className="bg-slate-100 px-2 py-1 rounded text-xs">shadow-xl</code> for elevation</p>
                  <p className="text-sm text-slate-600"><strong>Borders:</strong> <code className="bg-slate-100 px-2 py-1 rounded text-xs">border-blue-200/50</code> subtle</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600"><strong>Gradients:</strong> Multi-stop background gradients</p>
                  <p className="text-sm text-slate-600"><strong>Hover:</strong> Subtle gradient transitions</p>
                  <p className="text-sm text-slate-600"><strong>Text:</strong> Gradient text with <code className="bg-slate-100 px-2 py-1 rounded text-xs">bg-clip-text</code></p>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Service Action Buttons */}
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Modern Button Styles</h3>
                <div className="space-y-4">
                  <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg w-full">
                    🔧 Primary Action Button
                  </button>
                  <button className="bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-slate-700 px-6 py-3 rounded-lg font-semibold transition-all border border-blue-200 w-full">
                    📋 Secondary Action
                  </button>
                  <button className="bg-transparent hover:bg-gradient-to-r hover:from-blue-50 hover:to-orange-50 text-slate-600 px-6 py-3 rounded-lg font-semibold transition-all border-2 border-slate-300 w-full">
                    📞 Outline Button
                  </button>
                  <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600">
                    <strong>Implementation:</strong> Blue gradients for primary, amber for secondary, slate borders for outline
                  </div>
                </div>
              </div>

              {/* Service Cards */}
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">Glass-morphism Cards</h3>
                <div className="space-y-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 shadow-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">🛢️ Modern Service Card</h4>
                        <p className="text-slate-500 text-sm">Glass effect with subtle gradients</p>
                      </div>
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">30 min</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                      Clean glass-morphism design with refined color palette and subtle backdrop blur effects
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700 font-bold text-xl">$49.99</span>
                      <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
                        Schedule Now
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50/50 to-orange-50/50 rounded-xl p-6 border border-blue-200/30 shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-slate-700">🔧 Subtle Background Card</h4>
                        <p className="text-slate-500 text-sm">Light gradient background style</p>
                      </div>
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">45 min</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4">
                      Alternative card style with gradient backgrounds and refined hover effects
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold text-xl">FREE</span>
                      <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md">
                        Book Inspection
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-slate-50 rounded text-xs text-slate-600">
                    <strong>Card Styles:</strong> Glass cards use <code className="bg-white px-1 rounded">bg-white/90 backdrop-blur-sm</code>, gradient cards use <code className="bg-white px-1 rounded">from-blue-50/50 to-orange-50/50</code>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Automotive Branding Guidelines */}
          <section className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-6">Sunset Service Branding Guidelines</h2>
            <p className="text-slate-600 mb-8">Modern practices combining trust-building blues with approachable sunset warmth for contemporary automotive services</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">✅ Modern Design Do&apos;s</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">🔧</span>
                    Use blue gradients (blue-500 to blue-600) for primary CTAs and trust elements
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 font-bold">⏰</span>
                    Apply amber colors for alerts, urgent notifications, and time-sensitive content
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-slate-500 font-bold">🏆</span>
                    Use glass-morphism (white/90 + backdrop-blur-sm) for modern card designs
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 font-bold">📋</span>
                    Maintain slate colors (slate-600 to slate-800) for professional text
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">🎯</span>
                    Use subtle gradient backgrounds (blue-50/50 to orange-50/50) for depth
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-700 mb-4">❌ Modern Design Don&apos;ts</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">⚠️</span>
                    Don&apos;t use light blues or ambers for critical error states or warnings
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">💰</span>
                    Avoid excessive backdrop-blur effects that reduce readability
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">🔴</span>
                    Don&apos;t mix the refined palette with bright neon or saturated colors
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">📱</span>
                    Avoid complex gradients on small mobile interface elements
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-bold">🚫</span>
                    Don&apos;t combine more than 2 glass effects in a single component
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Service Status Indicators */}
            <div className="mt-8 pt-8 border-t border-blue-200/50">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">Modern Service Status System</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-200/50 shadow-md">
                  <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm"></div>
                  <span className="text-slate-700 font-medium text-sm">Confirmed</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-amber-200/50 shadow-md">
                  <div className="w-4 h-4 bg-amber-500 rounded-full shadow-sm"></div>
                  <span className="text-slate-700 font-medium text-sm">Urgent</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-orange-200/50 shadow-md">
                  <div className="w-4 h-4 bg-orange-400 rounded-full shadow-sm"></div>
                  <span className="text-slate-700 font-medium text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-slate-200/50 shadow-md">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm"></div>
                  <span className="text-slate-700 font-medium text-sm">Completed</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-700 mb-2">Implementation Guide</h4>
                <div className="text-sm text-slate-600 space-y-1">
                  <p><strong>Status Colors:</strong> Blue for confirmed/active, Amber for urgent/alerts, Orange for pending, Slate for completed/neutral</p>
                  <p><strong>Card Backgrounds:</strong> Use glass-morphism (white/80-90 + backdrop-blur) for modern elevated feel</p>
                  <p><strong>Gradients:</strong> Apply to large areas (page backgrounds) and button states, not small UI elements</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}