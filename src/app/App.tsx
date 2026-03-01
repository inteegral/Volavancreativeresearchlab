import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { AnalyticsProvider } from "./components/AnalyticsProvider";

export default function App() {
  return (
    <AnalyticsProvider>
      <RouterProvider router={router} />
    </AnalyticsProvider>
  );
}