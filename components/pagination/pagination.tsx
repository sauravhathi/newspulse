const Pagination = ({ page, setPage }: { page: number; setPage: any }) => {

    return (
        <div className="flex-c">
            <p className="xl-sm" aria-label="sort by">Page {page}</p>
            <button
                className={`p-2 m-2 rounded-md ${page < 1 ? 'bg-slate-300' : 'bg-slate-500 hover:bg-slate-600'} focus:outline-none`}
                onClick={() => setPage(page - 1)}
                disabled={page < 1}
                aria-label="previous page"
            >
                <svg
                    className="text-slate-50 md:w-6 md:h-6 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <button
                className={`p-2 m-2 rounded-md bg-slate-500 focus:outline-none`}
                onClick={() => setPage(page + 1)}
                aria-label="next page"
            >
                <svg
                    className="text-slate-50 md:w-6 md:h-6 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            </button>
        </div>
    )
}

export default Pagination