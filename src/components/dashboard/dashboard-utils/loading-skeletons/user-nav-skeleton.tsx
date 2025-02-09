import { Skeleton } from "@/components/ui/skeleton";

// In user-nav-skeleton.tsx
export function UserNavSkeleton() {
  return (
    <div className="flex items-center justify-start w-full">  
      <div className="relative">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}