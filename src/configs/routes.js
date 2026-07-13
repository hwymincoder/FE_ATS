import { ROLES } from '@/constants';

export const ROUTES = {
  LOGIN: '/staff/login',
  CANDIDATE_LOGIN: '/candidate/login',
  CANDIDATE_REGISTER: '/candidate/register',
  HOME: '/',
  DASHBOARD: '/dashboard',
  CANDIDATE_UPGRADE: '/candidate/upgrade',
  CANDIDATE_CHANGE_PASSWORD: '/candidate/change-password',
  CANDIDATE_CHECKOUT: '/candidate/checkout/:packageId',
  FORBIDDEN: '/forbidden',
};

export const ROUTE_ACCESS = {
  STAFF: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.INTERVIEWER],
  DASHBOARD: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.INTERVIEWER],
  DEPARTMENTS: [ROLES.ADMIN],
  PIPELINE_STAGES: [ROLES.ADMIN],
  UPGRADE_PACKAGES: [ROLES.ADMIN],
  USERS: [ROLES.ADMIN],
  INTERVIEWS: [ROLES.INTERVIEWER],
  RECRUITER: [ROLES.RECRUITER],
  CANDIDATE: [ROLES.CANDIDATE],
};

export const NAV_ITEMS = [
  {
    key: 'departments',
    label: 'Phòng ban',
    path: '/departments',
    icon: 'Building2',
    allowedRoles: ROUTE_ACCESS.DEPARTMENTS,
  },
  {
    key: 'pipeline-stages',
    label: 'Giai đoạn tuyển dụng',
    path: '/pipeline-stages',
    icon: 'Building2',
    allowedRoles: ROUTE_ACCESS.PIPELINE_STAGES,
  },
  {
    key: 'upgrade-packages',
    label: 'Gói nâng cấp',
    path: '/upgrade-packages',
    icon: 'Package',
    allowedRoles: ROUTE_ACCESS.UPGRADE_PACKAGES,
  },
  {
    key: 'users',
    label: 'Người dùng',
    path: '/users',
    icon: 'Users',
    allowedRoles: ROUTE_ACCESS.USERS,
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
  },
  {
    key: 'recruiter-applications',
    label: 'Applications',
    path: '/application',
    icon: 'ClipboardList',
    allowedRoles: ROUTE_ACCESS.RECRUITER,
  },
];
