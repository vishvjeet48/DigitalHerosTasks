import { ArrowRight, Users, TrendingUp, Zap } from 'lucide-react';
import { Button } from '../ui/Button';


export const Hero = () => {
  const scrollToForm = () => {
    document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const tile = 'rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/[0.06]';

  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 motion-safe:animate-slide-up md:grid-cols-12">
          <div className={`md:col-span-7 flex flex-col justify-center p-8 sm:p-10 ${tile} bg-white/[0.05]`}>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Capture Leads.
              <span className="block bg-gradient-to-r from-primary-200 to-indigo-200 bg-clip-text text-transparent">
                Grow Your Business.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-primary-100">
              LeadDesk Mini helps you capture, track, and manage leads effortlessly.
              Turn visitors into customers with our streamlined lead capture system.
            </p>

            <div className="mt-8">
              <Button
                size="lg"
                onClick={scrollToForm}
                className="group bg-white text-primary-700 hover:bg-primary-50 shadow-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className={`md:col-span-5 overflow-hidden ${tile}`}>
            <img
              src="https://i.pinimg.com/control1/736x/3f/e0/c1/3fe0c15c45d1770d7cb7cae86cf57a27.jpg"
              alt="LeadDesk Mini dashboard"
              className="h-full w-full object-cover"
            />
          </div>

          <div className={`md:col-span-4 flex flex-col items-center justify-center gap-3 p-6 text-center ${tile}`}>
            <Users className="h-6 w-6 text-primary-200" aria-hidden="true" />
            <span className="text-sm text-primary-100">Capture</span>
          </div>


          <div className={`md:col-span-4 flex flex-col items-center justify-center gap-3 p-6 text-center ${tile}`}>
            <TrendingUp className="h-6 w-6 text-primary-200" aria-hidden="true" />
            <span className="text-sm text-primary-100">Track</span>
          </div>

          <div className={`md:col-span-4 flex flex-col items-center justify-center gap-3 p-6 text-center ${tile}`}>
            <Zap className="h-6 w-6 text-primary-200" aria-hidden="true" />
            <span className="text-sm text-primary-100">Manage</span>
          </div>
        </div>
      </div>
    </section>
  );
};