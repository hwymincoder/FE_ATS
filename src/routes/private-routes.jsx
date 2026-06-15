import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const DepartmentList = lazy(() => import('@/pages/departments/components/DepartmentList'));
const DepartmentForm = lazy(() => import('@/pages/departments/components/DepartmentForm'));
// TODO: Jobs, PipelineStages, Candidates... copy theo pattern Department

export const privateRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/departments', element: <DepartmentList /> },
  { path: '/departments/new', element: <DepartmentForm /> },
  { path: '/departments/:id', element: <DepartmentForm /> },
];
