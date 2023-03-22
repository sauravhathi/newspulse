import React from 'react';

const LoadingSpinner = ({ newsLoaded }: { newsLoaded: boolean }) => {
    return (
        <>
            {newsLoaded && (
                <div className="my-2 flex flex-col items-center justify-center">
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx={12}
                            cy={12}
                            r={10}
                            stroke="currentColor"
                            strokeWidth={4}
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        />
                    </svg>
                    <p className="xl-sm">Loading...</p>
                </div>
            )}
        </>
    );
}

export default LoadingSpinner;