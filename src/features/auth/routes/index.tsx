import { Route, Routes } from 'react-router-dom';
import { Login } from '../views/Login';
import { SignUp } from '../views/SignUp';
import { ForgotPassword } from '../views/ForgotPassword';

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
    </Routes>
  );
};
