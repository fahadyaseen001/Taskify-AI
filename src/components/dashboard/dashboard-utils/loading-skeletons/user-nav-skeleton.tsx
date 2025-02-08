import { Skeleton } from "@/components/ui/skeleton";

export function UserNavSkeleton() {
    return (
      <div className="flex items-center justify-end w-full">
        <div className="relative">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    );
  }