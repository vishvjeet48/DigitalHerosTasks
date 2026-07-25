import { ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <h3 className="text-xl font-bold text-white">LeadDesk Mini</h3>
            <p className="mt-1 text-sm text-gray-400">
              Capture leads. Manage growth.
            </p>
          </div>

          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white"
          >
            Built for Digital Heroes Training Task
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LeadDesk Mini. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
