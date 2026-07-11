import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Loading } from '@/components/shared/loading';
import AuthLayout from '@/layouts/auth-layout';
import HomeLayout from '@/layouts/home-layout';
import MainLayout from '@/layouts/main-layout';
import CandidateChatGate from '@/pages/candidate/chatbot/CandidateChatGate';
import ProtectedRoute from '@/routes/protected-route';
import RoleRoute from '@/routes/role-route';
import { publicRoutes } from '@/routes/public-routes';
import { privateRoutes } from '@/routes/private-routes';
import { ROUTES } from '@/configs/routes';

const HomePage = lazy(() => import('@/pages/homes/home'));
const JobsPage = lazy(() => import('@/pages/homes/jobs'));

export default function AppRouter() {
  return (
    <BrowserRouter basename="/ats">
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<AuthLayout />}>
            {publicRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>

          <Route path={ROUTES.HOME} element={<HomeLayout />}>
            <Route index element={<HomePage />} />
          </Route>

          <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />

          <Route path="/home/jobs" element={<HomeLayout />}>
            <Route index element={<JobsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {privateRoutes.map((r) => (
              <Route
                key={r.path}
                path={r.path}
                element={<RoleRoute allowedRoles={r.allowedRoles}>{r.element}</RoleRoute>}
              />
            ))}
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <CandidateChatGate />
    </BrowserRouter>
  );
}
