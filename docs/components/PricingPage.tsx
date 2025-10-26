import FeatureMatrix from "./FeatureMatrix"


// Example usage
export default function PricingPage() {
  const Check = () => <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>

  const options = {
    plans: [
        { id: 'self', title: 'Self hosted', button: 'Get started' },
        { id: 'free', title: 'Free Cloud', button: 'Get Started' },
      { id: 'pro', title: 'Pro', button: '$99 / month' },
    ],
    featureGroups: [
      {
        title: 'Workflows',
        features: [
          { title: 'Number of workflows', plans: { self: '∞',free: '10', pro: '1.000' } },
          { title: 'Number of invocations', plans: { self: '∞',free: '10.000', pro: '1.000.000' } },
        ],
      },
      {
        title: 'Integrations',
        features: [
          { title: 'Access to all integrations', plans: { self: <Check />,free: <Check />, pro: <Check /> } },
        ],
      },
      {
        title: 'Runtimes',
        features: [
          { title: 'Custom runtimes', plans: { self: 'single runtime', free: 'runtime per workflow', pro: 'runtime per workflow' } },
        ],
      },
      {
        title: 'Collaboration',
        features: [
          { title: 'SSO Login', plans: { self: '',free: '', pro: <Check /> } },
        ],
      },

    ],
  }

  return <FeatureMatrix {...options} />
}