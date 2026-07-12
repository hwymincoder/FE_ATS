import { lazy } from 'react';

import { ROUTES } from '@/configs/routes';

const Login = lazy(() => import('@/pages/auth/login'));
const CandidateLogin = lazy(() => import('@/pages/auth/candidate-login'));
const CandidateRegister = lazy(() => import('@/pages/auth/candidate-register'));

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.CANDIDATE_LOGIN,
    element: <CandidateLogin />,
  },
  {
    path: ROUTES.CANDIDATE_REGISTER,
    element: <CandidateRegister />,
  },
];
