const NoFound = () => {
    return (
        <div className="my-2 flex flex-col items-center justify-center">
            <svg
                className="w-12 h-12 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
            <p className="xl-sm">No news found</p>
        </div>
    );
};

export default NoFound;