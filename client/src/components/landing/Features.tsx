import { BarChart3, Shield, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Submit leads in seconds with our optimized form experience.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with encrypted data transmission.',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Track lead status and monitor your pipeline in real-time.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: Users,
    title: 'Team Ready',
    description: 'Built for teams with admin dashboard and role management.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
];

export const Features = () => {
  return (
    <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose LeadDesk Mini?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to capture and manage leads effectively.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
