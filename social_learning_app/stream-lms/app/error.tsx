"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>

      <p className="mt-3 text-gray-600">
        {error.message || "Unexpected error occurred"}
      </p>

      <button
        onClick={() => reset()}
        className="mt-6 px-4 py-2 bg-black text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
