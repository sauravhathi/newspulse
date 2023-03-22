const Search = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: any }) => {

    // handle search query
    const handleSearch = (e: any) => {
        e.preventDefault();
        if (e.target.value.match(/[^a-zA-Z0-9 .,-]/) || e.target.value.match(/^ /)) {
            return;
        }
        setSearchQuery(e.target.value);
    };

    return (
        <div className="w-full md:w-5/12">
            <input
                type="text"
                placeholder="Search for news"
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;