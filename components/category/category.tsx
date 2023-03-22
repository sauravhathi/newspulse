const Category = ({ category, categories, setSort, setFreshness, setCategory, setSearchQuery, setPage }: { category: string; categories: any; setSort: any; setFreshness: any; setCategory: any; setSearchQuery: any; setPage: any }) => {
      // handle category
  const handleCategory = (e: string) => {
    setSearchQuery("");
    setPage(0);
    setFreshness("Day");
    setSort("Relevance");
    if (e === category) {
      setCategory("");
    }
    else {
      setCategory(e);
    }
  };

    return (
        <ul className="flex-wc justify-start">
            {categories.map((cat: any, index: number) => (
                <li
                    key={index}
                    className={`${cat.value === category ? 'bg-slate-500 text-slate-50' : 'bg-slate-300'} md:p-2 p-1 m-1 rounded-md cursor-pointer`}
                    onClick={() => handleCategory(cat.value)}
                    aria-label={cat.name}
                >
                    {cat.name}
                </li>
            ))}
        </ul>
    );
};

export default Category;