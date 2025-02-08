import { Skeleton } from "@/components/ui/skeleton";

export function ViewSkeleton() {
    return (
      <div className="flex items-center">
        <Skeleton className="h-9 w-24 rounded-md ml-2" />
      </div>
    );
  }