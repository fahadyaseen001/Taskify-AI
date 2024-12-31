import React from "react";
import { UserNav } from "@/components/dashboard/dashboard-components/user-nav";
import SkeletonLoader from "@/components/ui/skeleton-loader";

const LoadingPage: React.FC = () => {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <UserNav />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <SkeletonLoader className="h-8 w-1/3" />
          <SkeletonLoader className="h-4 w-1/2 mt-2" />
          <SkeletonLoader className="h-4 w-1/3 mt-2" />
        </div>
        <SkeletonLoader className="h-8 w-32 ml-auto" />
      </div>
      <SkeletonLoader className="h-10 w-full mt-4" />
      <SkeletonLoader className="h-10 w-full mt-4" />
      <SkeletonLoader className="h-10 w-full mt-4" />
    </div>
  );
};

export default LoadingPage;
