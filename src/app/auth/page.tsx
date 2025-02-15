'use client'

import AuthTabs from "@/components/auth/auth-tab";
import { AuthSkeleton } from "@/components/dashboard/dashboard-utils/loading-skeletons/auth-tab-skeleton";
import * as React from "react";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <div>
      <Suspense fallback={<AuthSkeleton />}>
        <AuthTabs />
      </Suspense>
    </div>
  );
}
