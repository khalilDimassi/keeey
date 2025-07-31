const LoadingSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
        {[...Array(count)].map((_, index) => (
            <div
                key={index}
                className="bg-white p-4 border-b border-gray-200 relative flex flex-col sm:flex-row gap-4"
            >
                <div className="w-16 h-16 rounded-full flex-shrink-0 mx-auto bg-gray-200 animate-pulse"></div>
                <div className="flex-1 min-w-0 space-y-3">
                    <div className="space-y-2">
                        <div className="h-6 w-3/4 rounded bg-gray-300"></div>
                        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-16 rounded-xl bg-gray-300"></div>
                        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-gray-200"></div>
                        <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                    </div>
                </div>
                <div className="absolute top-2 right-3 flex gap-4">
                    <div className="h-6 w-6 rounded-md bg-gray-300"></div>
                    <div className="h-6 w-6 rounded-md bg-gray-300"></div>
                </div>
            </div>
        ))}
    </div>
);

const ErrorSkeleton = () => (
    <div className="space-y-6 p-6 max-h-[70vh] overflow-y-auto">
        <div className="bg-white p-4 border-b border-red-500 relative flex flex-col sm:flex-row gap-4">
            <div className="w-16 h-16 rounded-full flex-shrink-0 mx-auto bg-red-200 animate-pulse"></div>
            <div className="flex-1 min-w-0 space-y-3">
                <div className="space-y-2">
                    <div className="h-6 w-3/4 rounded bg-red-300"></div>
                    <div className="h-4 w-1/4 rounded bg-red-200"></div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-6 w-16 rounded-xl bg-red-300"></div>
                    <div className="h-4 w-1/3 rounded bg-red-200"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-red-200"></div>
                    <div className="h-4 w-5/6 rounded bg-red-200">
                        <span className="sr-only">Error loading content</span>
                    </div>
                </div>
            </div>
            <div className="absolute top-2 right-3 flex gap-4">
                <div className="h-6 w-6 rounded-md bg-red-300"></div>
                <div className="h-6 w-6 rounded-md bg-red-300"></div>
            </div>
        </div>
    </div>
);

const EmptySkeleton = () => (
    <div className="p-6 max-h-[70vh] overflow-y-auto flex flex-col items-center justify-center h-full">
        <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-[#297280]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No opportunities found</h3>
        </div>
    </div>
);

export { LoadingSkeleton, ErrorSkeleton, EmptySkeleton };