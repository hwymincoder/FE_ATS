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
import { ROUTES, ROUTE_ACCESS } from '@/configs/routes';
import { ROLES } from '@/constants';
import PaymentCallbackHandler from '@/pages/candidate/payments/payment-callback-handler';

const HomePage = lazy(() => import('@/pages/homes/home'));
const JobsPage = lazy(() => import('@/pages/homes/jobs'));
const CandidateUpgradePage = lazy(() => import('@/pages/candidate/upgrade'));
const CandidateCheckoutPage = lazy(() => import('@/pages/candidate/checkout'));
const CandidateChangePasswordPage = lazy(() => import('@/pages/candidate/change-password'));

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
            <Route
              path={ROUTES.CANDIDATE_UPGRADE}
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
                    <CandidateUpgradePage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CANDIDATE_CHANGE_PASSWORD}
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
                    <CandidateChangePasswordPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.CANDIDATE_CHECKOUT}
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={[ROLES.CANDIDATE]}>
                    <CandidateCheckoutPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/home" element={<Navigate to={ROUTES.HOME} replace />} />

          <Route path="/home/jobs" element={<HomeLayout />}>
            <Route index element={<JobsPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={ROUTE_ACCESS.STAFF} redirectTo={ROUTES.HOME}>
                  <MainLayout />
                </RoleRoute>
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
      <PaymentCallbackHandler />
    </BrowserRouter>
  );
}
