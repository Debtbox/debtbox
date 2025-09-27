import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const Login = lazy(() =>
  import('../views/Login')
    .then((module) => ({ default: module.Login }))
    .catch(() =>
      import('../views/Login').then((module) => ({ default: module.Login })),
    ),
);

const SignUp = lazy(() =>
  import('../views/SignUp')
    .then((module) => ({ default: module.SignUp }))
    .catch(() =>
      import('../views/SignUp').then((module) => ({ default: module.SignUp })),
    ),
);

const ForgotPassword = lazy(() =>
  import('../views/ForgotPassword')
    .then((module) => ({ default: module.ForgotPassword }))
    .catch(() =>
      import('../views/ForgotPassword').then((module) => ({
        default: module.ForgotPassword,
      })),
    ),
);

export const AuthRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={<LoadingSpinner text="common.loading.authentication" />}
      >
        <Routes>
          <Route>
            <Route path="login" element={<Login />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};
