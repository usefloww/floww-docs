import React from 'react'
import CardSpread from './CardSpread'

export default function LandingPage() {
  return (
    <div className="bg-white dark:bg-slate-900 w-full">
      <div className="w-full px-8 md:px-12 lg:px-20 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Content */}
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                <span className="text-blue-600 dark:text-blue-400">Floww</span>
              </h1>

              <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Code first workflow automation
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Lightning fast execution
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Full TypeScript support
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Cron schedules & webhooks
                </span>
              </div>
               <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-slate-700 dark:text-slate-300">
                  Custom runtimes
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/docs/getting-started/quick-start"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Get Started
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - CardSpread */}
          <div className="flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <CardSpread
                gap={40}
                maxTilt={15}
                cardWidth={600}
                className="p-4"
                cardClassName="bg-transparent shadow-none"
              >
                <img
                  src="/cron_ts.png"
                  alt="Floww Code Example"
                  className="rounded-lg"
                />
                <img
                  src="/cron_ts.png"
                  alt="Cron Schedule Example"
                  className="rounded-lg"
                />
                <img
                  src="/cron_ts.png"
                  alt="Cron Schedule Example"
                  className="rounded-lg"
                />
              </CardSpread>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
