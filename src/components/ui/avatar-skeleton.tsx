import React from "react";
import SkeletonLoader from "@/components/ui/skeleton-loader";

const AvatarSkeleton: React.FC = () => {
  return <SkeletonLoader className="h-8 w-8 rounded-full" />;
};

export default AvatarSkeleton;
