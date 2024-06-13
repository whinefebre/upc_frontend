"use client";

import { GuestGuard } from "src/auth/guard";
import AuthClassicLayout from "src/layouts/auth/classic";
import JwtLoginView from "src/sections/auth/jwt/jwt-login-view";

// ----------------------------------------------------------------------

function Layout() {
  return (
    <GuestGuard>
      <AuthClassicLayout>
        <JwtLoginView />
      </AuthClassicLayout>
    </GuestGuard>
  );
}

export default Layout;
