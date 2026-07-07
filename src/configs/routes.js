import { ROLES } from '@/constants';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  FORBIDDEN: '/forbidden',
};

export const ROUTE_ACCESS = {
  DEPARTMENTS: [ROLES.ADMIN],
  INTERVIEWS: [ROLES.ADMIN, ROLES.INTERVIEWER],
  RECRUITER: [ROLES.RECRUITER],
};

export const NAV_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    key: 'departments',
    label: 'Phòng ban',
    path: '/departments',
    icon: 'Building2',
    allowedRoles: ROUTE_ACCESS.DEPARTMENTS,
  },
  {
    key: 'interviews',
    label: 'Phỏng vấn',
    path: '/interviews',
    icon: 'Building2',
    allowedRoles: ROUTE_ACCESS.INTERVIEWS,
  },
  {
    key: 'recruiter-jobs',
    label: 'Quản lý job',
    path: '/recruiter/jobs',
    icon: 'Briefcase',
    allowedRoles: ROUTE_ACCESS.RECRUITER,
  }
];
