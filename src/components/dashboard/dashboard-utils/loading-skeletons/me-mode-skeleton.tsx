import { Skeleton } from "@/components/ui/skeleton";

export function MeModeSkeleton() {
  return (
    <div className="flex items-center">
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  );
}