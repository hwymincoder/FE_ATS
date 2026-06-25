import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const DepartmentPage = lazy(() => import('@/pages/departments'));
const InterviewsPage = lazy(() => import('@/pages/interviews'));
// TODO: Jobs, PipelineStages, Candidates... copy theo pattern Department

export const privateRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/departments', element: <DepartmentPage /> },
  { path: '/interviews', element: <InterviewsPage /> },
];
