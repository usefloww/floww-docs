import React from 'react'

type Plan = {
  id: string
  title: string
  button: string
}

type Feature = {
  title: string
  plans: Record<string, React.ReactNode>
}

type FeatureGroup = {
  title: string
  features: Feature[]
}

type FeatureMatrixProps = {
  plans: Plan[]
  featureGroups: FeatureGroup[]
}

export function FeatureMatrix({ plans, featureGroups }: FeatureMatrixProps) {
  return (
    <div className="max-w-5xl mx-auto p-8 text-gray-900 dark:text-gray-100">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Compare & get your plan</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
          Compare the features of our plans and get the one that best suits your needs.
        </p>
      </div>

      <FeatureMatrixHeader plans={plans} />

      {featureGroups.map((group) => (
        <FeatureMatrixGroup key={group.title} title={group.title}>
          {group.features.map((f) => (
            <FeatureMatrixFeature key={f.title} title={f.title} plans={f.plans} planOrder={plans.map(p => p.id)} />
          ))}
        </FeatureMatrixGroup>
      ))}
    </div>
  )
}

export function FeatureMatrixHeader({ plans }: { plans: Plan[] }) {
  return (
    <div className="grid grid-cols-[1fr_repeat(3,minmax(0,1fr))] border-t border-gray-200 dark:border-gray-700">
      <div className="border-r dark:border-gray-700"></div>
      {plans.map((p) => (
        <div key={p.id} className="text-center p-4 border-r last:border-none dark:border-gray-700">
          <h3 className="font-semibold mb-2">{p.title}</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
            <div className="text-center mx-4 my-2">{p.button}</div>
          </button>
        </div>
      ))}
    </div>
  )
}

export function FeatureMatrixGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">{title}</h4>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">{children}</div>
    </div>
  )
}

export function FeatureMatrixFeature({ title, plans, planOrder }: { title: string; plans: Record<string, React.ReactNode>; planOrder: string[] }) {
  return (
    <div className="grid grid-cols-[1fr_repeat(3,minmax(0,1fr))] py-3 text-sm">
      <div className="font-medium text-gray-800 dark:text-gray-200">{title}</div>
      {planOrder.map((id) => (
        <div key={id} className="text-center text-gray-700 dark:text-gray-300">{plans[id]}</div>
      ))}
    </div>
  )
}