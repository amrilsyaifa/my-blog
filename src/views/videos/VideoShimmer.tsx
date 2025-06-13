const VideoShimmer = () => {
  return (
    <div
      role="status"
      className="w-full animate-pulse h-[calc(100vh-10em)] md:h-[calc(100vh-18em)] overflow-hidden"
    >
      <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4" />
      <div className="h-80 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4" />
      <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4 mt-8" />
      <div className="h-80 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4" />
      <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4 mt-8" />
      <div className="h-80 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4" />
      <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4 mt-8" />
      <div className="h-80 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4" />
      <div className="h-4 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4 mt-8" />
      <div className="h-80 bg-gray-200 rounded-md dark:bg-gray-700 w-full mb-4" />
    </div>
  );
};

export default VideoShimmer;
