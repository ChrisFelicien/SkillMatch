import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  LoginPage,
  SignupPage,
  JobDetailsPage,
  JobPage,
  ErrorPage,
  Dashboard,
  HomePage,
  LayoutPage,
  SingleErrorPage
} from "./pages";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/jobs",
        element: <JobPage />
      },
      {
        path: "jobs/:jobId",
        element: <JobDetailsPage />
      },
      {
        path: "/dashboard",
        element: <Dashboard />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  }
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
