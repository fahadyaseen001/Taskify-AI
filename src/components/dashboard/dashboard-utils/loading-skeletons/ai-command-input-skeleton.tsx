import { Skeleton } from "@/components/ui/skeleton";

export function AICommandInputSkeleton() {
  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 z-50">
      <Skeleton className="h-10 w-10 rounded-full mx-auto md:mx-0" />
    </div>
  );
}
