import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "../pages/dashboard";
import { Settings } from "../pages/Settings";
import { LogsPage } from "../pages/Logs";
import { Layout } from "../components/layout";
import { AuthCallback } from "../pages/AuthCallback";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "logs",
        element: <LogsPage />,
      },
      {
        path: "auth/callback/:platform",
        element: <AuthCallback />,
      },
    ],
  },
]);
