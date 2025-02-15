import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";


export const AuthSkeleton = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-10 w-40" />
        
      </div>
      <div className="w-full max-w-[400px]">
      <div className="flex flex-row items-center justify-center gap-2">
  <Skeleton className="h-8 w-full mb-4 rounded-lg" />
  <Skeleton className="h-8 w-full mb-4 rounded-lg" />
</div>

        <Card className="w-full">
          <Skeleton className="h-5 w-24 m-6" />
          <Skeleton className="h-7 w-48 mx-6 mb-2" />
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="p-6 pt-0">
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    </div>
  );
};