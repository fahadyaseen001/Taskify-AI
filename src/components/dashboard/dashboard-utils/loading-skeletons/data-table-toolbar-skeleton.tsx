import { Skeleton } from "@/components/ui/skeleton";
import { MeModeSkeleton } from "./me-mode-skeleton";
import { ViewSkeleton } from "./view-dropdown";

export function DataTableToolbarSkeleton() {
    return (
      <div className="w-full space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          {/* Search Input */}
          <Skeleton className="h-8 w-full md:w-[250px]" />
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24" /> {/* Status Filter */}
            <Skeleton className="h-8 w-24" /> {/* Priority Filter */}
            <Skeleton className="h-8 w-24" /> {/* Assignee Filter */}
          </div>
          <div className="flex items-center justify-between w-full md:w-auto md:ml-auto gap-2">
            <div className="flex-1 md:flex-none">
              <MeModeSkeleton />
            </div>
            <ViewSkeleton />
          </div>
        </div>
      </div>
    );
  }