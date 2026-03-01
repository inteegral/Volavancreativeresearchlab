import { Link, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  console.error('🚨 Route Error:', error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#6A746C] text-[#F5F5F0] px-6">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Icon or visual element */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#B5DAD9]/30 flex items-center justify-center">
            <span className="font-['Cormorant_Garamond'] text-4xl italic text-[#B5DAD9]">!</span>
          </div>
        </div>

        {/* Error title */}
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl italic text-[#F5F5F0]">
          Oops! Something went wrong
        </h1>

        {/* Error message */}
        <p className="font-['Manrope'] text-sm text-[#F5F5F0]/70 leading-relaxed max-w-xl mx-auto">
          We encountered an unexpected error while loading this page. 
          Please try refreshing or return to the homepage.
        </p>

        {/* Error details (only in development) */}
        {import.meta.env.DEV && error && (
          <div className="mt-8 p-6 bg-[#F5F5F0]/5 border border-[#F5F5F0]/10 rounded text-left">
            <p className="font-['Manrope'] text-xs uppercase tracking-wider text-[#B5DAD9] mb-3">
              Error Details:
            </p>
            <pre className="font-mono text-xs text-[#F5F5F0]/80 overflow-x-auto">
              {error.message || String(error)}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full border border-[#F5F5F0]/30 hover:border-[#F5F5F0]/80 hover:bg-[#F5F5F0]/5 transition-all duration-300"
          >
            <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em]">
              Refresh Page
            </span>
          </button>

          <Link
            to="/"
            className="px-8 py-3 rounded-full bg-[#B5DAD9]/20 border border-[#B5DAD9]/40 hover:bg-[#B5DAD9]/30 transition-all duration-300"
          >
            <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-[#B5DAD9]">
              Go to Homepage
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
