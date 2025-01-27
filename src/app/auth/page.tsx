'use client'

import AuthTabs from "@/components/auth/auth-tab";
import * as React from "react";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthTabs />
      </Suspense>
    </div>
  );
}
