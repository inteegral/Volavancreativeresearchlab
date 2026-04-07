import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";

// Layouts
import { PublicLayout } from "./layouts/PublicLayout";

// Public Pages
import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Artists from "./pages/public/Artists";
import ArtistDetail from "./pages/public/ArtistDetail";
import Residencies from "./pages/public/Residencies";
import ResidencyDetail from "./pages/public/ResidencyDetail";
import Journal from "./pages/public/Journal";
import JournalDetail from "./pages/public/JournalDetail";
import Candidature from "./pages/public/Candidature";
import Apply from "./pages/public/Apply";

// Debug
import DebugSanity from "./pages/DebugSanity";

// Error Boundary
import { ErrorBoundary } from "./components/ErrorBoundary";

// Root wrapper with providers
function RootWrapper() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
            focusThrottleInterval: 5000,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            onError: (error) => {
              console.error('❌ SWR Error:', error);
            },
          }}
        >
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: '#6A746C',
                color: '#F5F5F0',
                border: '1px solid rgba(245, 245, 240, 0.1)',
              },
            }}
          />
          <Outlet />
        </SWRConfig>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        Component: PublicLayout,
        children: [
          { index: true, Component: Home },
          { path: "about", Component: About },
          { path: "artists", Component: Artists },
          { path: "artists/:slug", Component: ArtistDetail },
          { path: "residencies", Component: Residencies },
          { path: "residencies/:slug", Component: ResidencyDetail },
          { path: "journal", Component: Journal },
          { path: "journal/:slug", Component: JournalDetail },
          { path: "candidature", Component: Candidature },
          { path: "apply/:slug", Component: Apply },
          { path: "debug-sanity", Component: DebugSanity },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);