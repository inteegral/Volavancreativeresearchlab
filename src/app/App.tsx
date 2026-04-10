import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { AnalyticsProvider } from "./components/AnalyticsProvider";
import { SpeedInsights } from "@vercel/speed-insights/react";

export default function App() {
  return (
    <AnalyticsProvider>
      <RouterProvider router={router} />
      <SpeedInsights />
    </AnalyticsProvider>
  );
}