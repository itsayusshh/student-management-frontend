import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-lg">
        !
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
