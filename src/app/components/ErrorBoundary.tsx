import { Link, useRouteError } from "react-router";

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  console.error('🚨 Route Error:', error);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-volavan-earth text-volavan-cream px-6">
      <div className="max-w-2xl w-full space-y-8 text-center">
        {/* Icon or visual element */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-volavan-aqua/30 flex items-center justify-center">
            <span className="font-['Cormorant_Garamond'] text-4xl italic text-volavan-aqua">!</span>
          </div>
        </div>

        {/* Error title */}
        <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl italic text-volavan-cream">
          Oops! Something went wrong
        </h1>

        {/* Error message */}
        <p className="font-['Manrope'] text-sm text-volavan-cream/70 leading-relaxed max-w-xl mx-auto">
          We encountered an unexpected error while loading this page. 
          Please try refreshing or return to the homepage.
        </p>

        {/* Error details (only in development) */}
        {import.meta.env.DEV && error && (
          <div className="mt-8 p-6 bg-volavan-cream/5 border border-volavan-cream/10 rounded text-left">
            <p className="font-['Manrope'] text-xs uppercase tracking-wider text-volavan-aqua mb-3">
              Error Details:
            </p>
            <pre className="font-mono text-xs text-volavan-cream/80 overflow-x-auto">
              {error.message || String(error)}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full border border-volavan-cream/30 hover:border-volavan-cream/80 hover:bg-volavan-cream/5 transition-all duration-300"
          >
            <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em]">
              Refresh Page
            </span>
          </button>

          <Link
            to="/"
            className="px-8 py-3 rounded-full bg-volavan-aqua/20 border border-volavan-aqua/40 hover:bg-volavan-aqua/30 transition-all duration-300"
          >
            <span className="font-['Manrope'] text-xs uppercase tracking-[0.2em] text-volavan-aqua">
              Go to Homepage
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
