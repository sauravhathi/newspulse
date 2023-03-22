const Freshness = ({ setFreshness, freshness, freshnessCat }: { setFreshness: any; freshness: string; freshnessCat: any }) => {
    return (
        <div className="flex-c">
            <p className="xl-sm">Freshness</p>
            <select
                className="sort"
                value={freshness}
                onChange={(e) => setFreshness(e.target.value)}
                aria-label="freshness"
            >
                {freshnessCat.map((fres: any, index: number) => (
                    <option key={index} value={fres.value} aria-label={fres.name}>
                        {fres.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Freshness