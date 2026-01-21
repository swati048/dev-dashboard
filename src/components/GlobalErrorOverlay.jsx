export default function GlobalErrorOverlay({ error, resetErrorBoundary }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] text-white">
      <div className="p-6 bg-[#1c1c1c] rounded-lg border border-red-600 shadow-lg max-w-md text-center">
        <h1 className="text-xl font-bold text-red-400 mb-2">
          Something went wrong.
        </h1>

        <p className="text-sm text-gray-300 mb-4">
          {error?.message || "An unexpected error occurred."}
        </p>

        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          onClick={resetErrorBoundary}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
