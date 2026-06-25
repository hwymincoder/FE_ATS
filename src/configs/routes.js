export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  // TODO: JOBS, PIPELINE_STAGES, CANDIDATES, APPLICATIONS...
  // Routes từng trang nằm trong src/pages/<name>/constants
};

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { key: 'departments', label: 'Phòng ban', path: '/departments', icon: 'Building2' },
  { key: 'interviews', label: 'Phỏng vấn', path: '/interviews', icon: 'Building2' },
  // TODO: thêm menu Jobs, PipelineStages... tương ứng
];
