import { lazy } from 'react';

import { ROUTES } from '@/configs/routes';

const Login = lazy(() => import('@/pages/auth/login'));
const CandidateLogin = lazy(() => import('@/pages/auth/candidate-login'));

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.CANDIDATE_LOGIN,
    element: <CandidateLogin />,
  },
];
