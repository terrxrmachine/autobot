import React from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ErrorBoundary } from "./components/errorboundary";
import { router } from "./routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
