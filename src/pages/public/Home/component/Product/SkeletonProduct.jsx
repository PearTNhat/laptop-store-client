// eslint-disable-next-line react/prop-types
function SkeletonProduct({ className = "" }) {
  return (
    <div
      className={`rounded-md border border-gray-300 animate-pulse ${className}`}
    >
      <div className="mb-3 relative">
        <div className="css-w-img">
          <div className="css-img-item bg-gray-200 aspect-square" />
        </div>

        <div className="hidden group-hover:flex justify-center items-center gap-2 w-full absolute">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="p-2 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
      </div>
    </div>
  );
}

export default SkeletonProduct;
