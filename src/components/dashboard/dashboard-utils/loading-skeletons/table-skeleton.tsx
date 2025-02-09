import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rowCount?: number;
}

export function TableSkeleton({ rowCount = 0 }: TableSkeletonProps) {
  const skeletonRows = Array(rowCount).fill(null);
  
  return (
    <div className="rounded-md border">
      {/* Table Header */}
      <div className="border-b">
        <div className="grid grid-cols-[24px_60px_1fr_1fr_80px_80px_70px_100px_50px] sm:grid-cols-[28px_100px_1fr_1.5fr_120px_120px_100px_180px_70px] gap-2 sm:gap-4 items-center h-10 px-2 sm:px-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12 sm:w-16" />
          <Skeleton className="h-4 max-w-[120px] sm:max-w-[200px]" />
          <Skeleton className="h-4 max-w-[180px] sm:max-w-[300px]" />
          <Skeleton className="h-4 w-14 sm:w-20" />
          <Skeleton className="h-4 w-16 sm:w-24" />
          <Skeleton className="h-4 w-14 sm:w-20" />
          <Skeleton className="h-4 w-20 sm:w-32" />
          <Skeleton className="h-4 w-6 sm:w-8" />
        </div>
      </div>

      {/* Table Rows */}
      <div>
        {skeletonRows.map((_, index) => (
          <div 
            key={index} 
            className="grid grid-cols-[24px_60px_1fr_1fr_80px_80px_70px_100px_50px] sm:grid-cols-[28px_100px_1fr_1.5fr_120px_120px_100px_180px_70px] gap-2 sm:gap-4 items-center h-16 px-2 sm:px-4 border-b"
          >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12 sm:w-16" />
            <Skeleton className="h-4 max-w-[120px] sm:max-w-[200px]" />
            <Skeleton className="h-4 max-w-[180px] sm:max-w-[300px]" />
            <Skeleton className="h-4 w-14 sm:w-20" />
            <Skeleton className="h-4 w-16 sm:w-24" />
            <Skeleton className="h-4 w-14 sm:w-20" />
            <Skeleton className="h-4 w-20 sm:w-32" />
            <Skeleton className="h-8 w-6 sm:w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}