export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="relative w-24 h-24">
                <div className="absolute top-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                <div className="absolute top-0 w-full h-full border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-xl font-medium text-gray-600">Đang tải...</p>
        </div>
    );
}
