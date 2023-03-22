import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { NewsItem } from '@/components/news/utility/newsTypes';
import Article from '@/components/news/article';
import LoadingSpinner from '@/components/news/utility/loadingSpinner';
import NoFound from '@/components/news/utility/noFound';
import { useDebounce } from '@/components/news/utility/useDebounce';
import axios from 'axios';
import NodeCache from "node-cache";
const cache = new NodeCache();

export default function Home() {
  const [category, setCategory] = useState(''); // category for news
  const [searchQuery, setSearchQuery] = useState(""); // search query
  const debouncedQuery = useDebounce(searchQuery, 500); // 500 ms delay before search query is sent to API
  const [newsLoaded, setNewsLoaded] = useState(false); // api call loading state
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // page number for pagination using offset
  const [empty, setEmpty] = useState(false);

  const [sort, setSort] = useState('Relevance');
  const [freshness, setFreshness] = useState('Day');

  // storing news data
  const [news, setNews] = useState<NewsItem[]>([{
    name: '', url: '', image: { thumbnail: { contentUrl: '', } }, description: '', datePublished: '', provider: [{ name: '' }]
  },
  ]);

  // options for category, sort by and freshness
  const options = {
    categories: [
      { name: "India", value: "India" },
      { name: "World", value: "World" },
      { name: "Business", value: "Business" },
      { name: "Entertainment", value: "Entertainment" },
      { name: "Sports", value: "Sports" },
      { name: "Sci/Tech", value: "ScienceAndTechnology" },
      { name: "Lifestyle", value: "Lifestyle" },
      { name: "Politics", value: "Politics" },
      { name: "Health", value: "Health" },
      { name: "Travel", value: "Travel" },
      { name: "Food", value: "FoodAndDrink" },
      { name: "Weather", value: "Weather" },
      { name: "Auto", value: "Auto" },
      { name: "Video", value: "Video" },
      { name: "Money", value: "Money" },
      { name: "Jobs", value: "Jobs" },
      { name: "Real Estate", value: "RealEstate" },
      { name: "Education", value: "Education" },
      { name: "Family", value: "Family" },
      { name: "Crime", value: "Crime" },
      { name: "Opinion", value: "Opinion" },
      { name: "Local", value: "Local" },
    ],
    sortBy: [
      { name: "Relevance", value: "Relevance" },
      { name: "Date", value: "Date" },
    ],
    freshness: [
      { name: "Day", value: "Day" },
      { name: "Week", value: "Week" },
      { name: "Month", value: "Month" },
    ],
  };

  // fetch news from bing news api using axios and endpoint in proxy server in next.config.js
  const fetchNews = async () => {
    setNewsLoaded(true);
    const cacheKey = `news-${category}-${searchQuery}-${page}-${sort}-${freshness}`;
    const cachedData: NewsItem[] | undefined = cache.get(cacheKey);
    if (cachedData) {
      setNews(cachedData);
      setNewsLoaded(false);
      console.log("cached");
      return cachedData;
    }
    try {
      const res = await axios.get(
        `/search?q=${searchQuery || category}&offset=${page * 20}&count=20&setLang=en&sortBy=${sort}&freshness=${freshness}&headlineCount=20`,
        {
          headers: {
            "Ocp-Apim-Subscription-Key":
              process.env.NEXT_PUBLIC_BING_NEWS_API_KEY,
          },
        }
      );
      setNews(res.data.value);
      console.log(res.data.value);
      setEmpty(res.data.value.length === 0);
      setNewsLoaded(false);
      cache.set(cacheKey, res.data.value, 60 * 60); // Cache for 1 hour
    } catch (err: any) {
      setError(err);
      setNewsLoaded(false);
    }
  };

  /* eslint-disable no-use-before-define */
  let useeffectcalled = false; // prevent useEffect from running on initial render
  // useEffect to fetch news on initial render and when category or search query or page number or sort by changes
  useEffect(() => {
    if (!useeffectcalled || debouncedQuery) {
      useeffectcalled = true;
      console.log("Made with ❤️ by @sauravhathi");
      fetchNews();
    }
  }, [useeffectcalled, debouncedQuery, category, page, sort, freshness]);

  // handle search query
  const handleSearch = (e: any) => {
    e.preventDefault();
    if (e.target.value.match(/[^a-zA-Z0-9 .,-]/) || e.target.value.match(/^ /)) {
      return;
    }
    setSearchQuery(e.target.value);
  };

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

  // error state when api call fails to fetch news
  if (error) {
    return <div className="flex flex-col items-center justify-center h-screen">
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
      <p className="xl-sm">{(error as any).message}</p>
    </div>;
  }

  console.log(news);

  return (
    <>
      <Head>
        <title>NewsPulse</title>
        <meta name="description" content={`${process.env.NEXT_PUBLIC_SITE_NAME} - Get the latest news from around the world`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container-news">
        <main>
          <h1 className="text-4xl md:text-6xl font-bold">NewsPulse</h1>
          <p className="description" aria-label="description">
            Get the latest news from around the world
          </p>
          <div className="w-full md:w-5/12">
            <input
              type="text"
              placeholder="Search for news"
              className="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {news.length > 1 && (
            <div className="flex flex-col w-full sm:px-5 md:px-10 xl:px-20">
              <ul className="flex-wc justify-start">
                {options.categories.map((cat, index) => (
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
              <div className="flex-wc justify-between">
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
                <div className="flex-c">
                  <p className="xl-sm">Sort by</p>
                  <select
                    className="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="sort by"
                  >
                    {options.sortBy.map((opt, index) => (
                      <option key={index} value={opt.value} aria-label={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-c">
                  <p className="xl-sm">Freshness</p>
                  <select
                    className="sort"
                    value={freshness}
                    onChange={(e) => setFreshness(e.target.value)}
                    aria-label="freshness"
                  >
                    {options.freshness.map((fres, index) => (
                      <option key={index} value={fres.value} aria-label={fres.name}>
                        {fres.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold mt-2 mb-4"
                aria-label="today&apos;s news"
              >Today&apos;s News</h1>
              <LoadingSpinner
                newsLoaded={newsLoaded}
              />
              <Article
                news={news}
              />
            </div>
          )}
          {empty && (
            <NoFound />
          )}
        </main>
        {/* Saurav Hathi */}
        <footer
          aria-label="footer"
        >
          <a
            className="flex-c justify-center"
            href="https://github.com/sauravhathi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="xl-b">Saurav Hathi</span>
          </a>
        </footer>
      </div>
    </>
  );
}