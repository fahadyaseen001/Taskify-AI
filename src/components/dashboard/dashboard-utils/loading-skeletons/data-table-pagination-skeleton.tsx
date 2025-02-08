import { Skeleton } from "@/components/ui/skeleton";

export function DataTablePaginationSkeleton() {
    return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2 py-4">
        {/* Selected Rows Text */}
        <Skeleton className="h-4 w-48" />
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-8">
          {/* Rows Per Page */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
  
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" /> {/* Page numbers */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-8 w-8" /> {/* First page */}
              <Skeleton className="h-8 w-8" /> {/* Previous */}
              <Skeleton className="h-8 w-8" /> {/* Next */}
              <Skeleton className="h-8 w-8" /> {/* Last page */}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Optional: Action Cell Skeleton if needed separately
  export function ActionCellSkeleton() {
    return (
      <div className="flex justify-end">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    );
  }