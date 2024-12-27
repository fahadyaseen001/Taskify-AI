import React from "react";
import classNames from "classnames";

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={classNames("animate-pulse bg-gray-300 rounded", className)} />
  );
};

export default SkeletonLoader;

