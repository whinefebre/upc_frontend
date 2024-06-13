'use client';

import { GuestGuard } from 'src/auth/guard';
import AuthClassicLayout from 'src/layouts/auth/classic';
import JwtLoginView from 'src/sections/auth/jwt/jwt-login-view';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <AuthClassicLayout>
       <JwtLoginView/>
      </AuthClassicLayout>
    </GuestGuard>
  );
}