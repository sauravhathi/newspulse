const SortBy = ({ setSort, sort, sortBy }: { setSort: any; sort: string; sortBy: any }) => {

  return (
    <div className="flex-c">
      <p className="xl-sm">Sort by</p>
      <select
        className="sort"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="sort by"
      >
        {sortBy.map((opt: any, index: number) => (
          <option key={index} value={opt.value} aria-label={opt.name}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortBy
