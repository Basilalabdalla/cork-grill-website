import React from 'react';

const SkeletonRow = () => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-200">
    <div className="flex-1 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse mt-2"></div>
    </div>
    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rounded-md animate-pulse flex-shrink-0"></div>
  </div>
);

const MenuSkeleton = () => {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      {/* Skeleton for Category Title */}
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      {/* Show a few skeleton rows to mimic the menu */}
      <div className="flex flex-col">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </div>
  );
};

export default MenuSkeleton;