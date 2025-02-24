'use client'

import AuthTabs from "@/components/auth/auth-tab";
import { AuthSkeleton } from "@/components/dashboard/dashboard-utils/loading-skeletons/auth-tab-skeleton";
import { BackgroundPaths } from "@/components/ui/background";
import * as React from "react";
import { Suspense } from "react";

export default function AuthPage() {
  return (
    <BackgroundPaths>
      <Suspense fallback={<AuthSkeleton />}>
        <AuthTabs />
      </Suspense>
    </BackgroundPaths>
    
  );
}
