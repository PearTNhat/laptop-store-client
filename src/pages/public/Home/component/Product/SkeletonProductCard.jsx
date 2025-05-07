/* eslint-disable react/prop-types */
function SkeletonProductCard({ className = "" }) {
  return (
    <div
      className={`w-full rounded-md border border-gray-200 animate-pulse ${className}`}
    >
      <div className="flex">
        <div className="w-[30%] bg-gray-200 h-full">
          <div className="aspect-square bg-gray-300"></div>
        </div>
        <div className="w-[70%] p-2 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonProductCard;
