import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import "./index.css";
import AppShell from "./layouts/AppShell";
import DashboardPage from "./pages/DashboardPage";
import PracticePage from "./pages/PracticePage";
import AssessmentsPage from "./pages/AssessmentsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ProfilePage from "./pages/ProfilePage";
import ResultsPage from "./pages/ResultsPage";
import TestChecklistPage from "./pages/TestChecklistPage";
import ShipGatePage from "./pages/ShipGatePage";
import RBStepPage from "./pages/RBStepPage";
import RBProofPage from "./pages/RBProofPage";
import ResumeHomePage from "./pages/ResumeHomePage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import ResumePreviewPage from "./pages/ResumePreviewPage";
import ResumeProofPage from "./pages/ResumeProofPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ResumeHomePage />,
  },
  {
    path: "/builder",
    element: <ResumeBuilderPage />,
  },
  {
    path: "/preview",
    element: <ResumePreviewPage />,
  },
  {
    path: "/proof",
    element: <ResumeProofPage />,
  },
  {
    path: "/results",
    element: <ResultsPage />,
  },
  {
    path: "/prp/07-test",
    element: <TestChecklistPage />,
  },
  {
    path: "/prp/08-ship",
    element: <ShipGatePage />,
  },
  {
    path: "/rb/01-problem",
    element: <RBStepPage stepNumber={1} />,
  },
  {
    path: "/rb/02-market",
    element: <RBStepPage stepNumber={2} />,
  },
  {
    path: "/rb/03-architecture",
    element: <RBStepPage stepNumber={3} />,
  },
  {
    path: "/rb/04-hld",
    element: <RBStepPage stepNumber={4} />,
  },
  {
    path: "/rb/05-lld",
    element: <RBStepPage stepNumber={5} />,
  },
  {
    path: "/rb/06-build",
    element: <RBStepPage stepNumber={6} />,
  },
  {
    path: "/rb/07-test",
    element: <RBStepPage stepNumber={7} />,
  },
  {
    path: "/rb/08-ship",
    element: <RBStepPage stepNumber={8} />,
  },
  {
    path: "/rb/proof",
    element: <RBProofPage />,
  },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "practice", element: <PracticePage /> },
      { path: "assessments", element: <AssessmentsPage /> },
      { path: "resources", element: <ResourcesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
