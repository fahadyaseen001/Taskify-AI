import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
    rowCount?: number;
  }
  
  export function TableSkeleton({ rowCount = 1 }: TableSkeletonProps) {
    const skeletonRows = Array(rowCount).fill(null);
    
    return (
      <div className="rounded-md border">
        {/* Table Header */}
        <div className="border-b">
          <div className="grid grid-cols-[28px_100px_1fr_1.5fr_120px_120px_100px_180px_70px] gap-6 items-center h-10 px-4">
            <Skeleton className="h-4 w-4" /> {/* Checkbox */}
            <Skeleton className="h-4 w-16" /> {/* Task ID */}
            <Skeleton className="h-4 w-full max-w-[200px]" /> {/* Title */}
            <Skeleton className="h-4 w-full max-w-[300px]" /> {/* Description */}
            <Skeleton className="h-4 w-20" /> {/* Status */}
            <Skeleton className="h-4 w-24" /> {/* Due Date */}
            <Skeleton className="h-4 w-20" /> {/* Priority */}
            <Skeleton className="h-4 w-32" /> {/* Assignee */}
            <Skeleton className="h-4 w-8" /> {/* Actions */}
          </div>
        </div>
  
        {/* Table Rows */}
        <div>
          {skeletonRows.map((_, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[28px_100px_1fr_1.5fr_120px_120px_100px_180px_70px] gap-6 items-center h-16 px-4 border-b"
            >
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-full max-w-[200px]" />
              <Skeleton className="h-4 w-full max-w-[300px]" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }