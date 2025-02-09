import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "./table-skeleton";
import { DataTableToolbarSkeleton } from "./data-table-toolbar-skeleton";
import { DataTablePaginationSkeleton } from "./data-table-pagination-skeleton";
import { UserNavSkeleton } from "./user-nav-skeleton";
import { AICommandInputSkeleton } from "./ai-command-input-skeleton";

interface DashboardSkeletonProps {
  taskCount?: number;
}

export function DashboardSkeleton({ taskCount = 0 }: DashboardSkeletonProps) {
  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-4 md:p-8">
        <UserNavSkeleton />

      {/* Header Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Welcome back text */}
          <Skeleton className="h-5 w-72" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-full md:w-40" /> {/* Add New Task button */}
      </div>

      {/* Data Table Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <DataTableToolbarSkeleton />
    
        </div>
        <TableSkeleton rowCount={taskCount} />
        <DataTablePaginationSkeleton />
      </div>

      {/* AI Command Input Skeleton */}
      <AICommandInputSkeleton />
    </div>
  );
}