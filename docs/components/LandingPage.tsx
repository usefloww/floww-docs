import React from 'react'
import CardSpread from './CardSpread'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 w-full">
      <div className="w-full px-8 md:px-12 lg:px-20 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Content */}
          <div className="space-y-10">
            {/* Hero Section */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                Automate with{' '}
                <span className="text-blue-600 dark:text-blue-400">TypeScript</span>
              </h1>

              <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                Build workflows triggered by schedules, webhooks, or events.
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
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/docs/quick-start/"
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
              <a
                href="/docs/"
                className="inline-flex items-center justify-center px-8 py-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-lg transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>

          {/* Right side - CardSpread */}
          <div className="flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
            <div className="relative w-full max-w-sm lg:max-w-md">
              <CardSpread
                gap={40}
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
              </CardSpread>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mt-40 w-full">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">
              What can you build?
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Scheduled Workflows
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Run cleanup jobs, sync data, or trigger reports with cron
                  schedules.
                </p>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Webhook Automations
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  React instantly to incoming events from your apps or APIs.
                </p>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Event Pipelines
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Chain multiple actions and build lightweight backend
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Reference Section */}
        <div className="mt-40 w-full">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center">
              Start building today
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <a
                href="/docs/quick-start/"
                className="group p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Quick Start
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Get up and running in minutes
                  </p>
                </div>
              </a>

              <a
                href="/docs/concepts/"
                className="group p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Core Concepts
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Understand the fundamentals
                  </p>
                </div>
              </a>

              <a
                href="/reference/api/"
                className="group p-8 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    API Reference
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Complete documentation
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
