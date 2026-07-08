import { lazy } from 'react';

import { ROUTES, ROUTE_ACCESS } from '@/configs/routes';
import { ROLES } from '@/constants';

const Dashboard = lazy(() => import('@/pages/dashboard'));
const DepartmentPage = lazy(() => import('@/pages/departments'));
const InterviewsPage = lazy(() => import('@/pages/interviews'));
const ForbiddenPage = lazy(() => import('@/pages/errors/forbidden'));
const RecruiterJobsPage = lazy(() => import('@/pages/recruiter/jobs'));
const RecruiterApplicationsPage = lazy(() => import('@/pages/recruiter/applications'));
const RecruiterApplicationKanbanPage = lazy(() => import('@/pages/recruiter/applications/kanban'));

export const privateRoutes = [
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: '/departments',
    element: <DepartmentPage />,
    allowedRoles: ROUTE_ACCESS.DEPARTMENTS,
  },
  {
    path: '/interviews',
    element: <InterviewsPage />,
    allowedRoles: ROUTE_ACCESS.INTERVIEWS,
  },
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: '/recruiter/jobs',
    element: <RecruiterJobsPage />,
    allowedRoles: [ROLES.RECRUITER],
  },
  {
    path: '/application',
    element: <RecruiterApplicationsPage />,
    allowedRoles: [ROLES.RECRUITER],
  },
  {
    path: '/application/:jobId/kanban',
    element: <RecruiterApplicationKanbanPage />,
    allowedRoles: [ROLES.RECRUITER],
  },
];
