import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import axios from 'axios';
import NodeCache from "node-cache";
const cache = new NodeCache();

// date format function for news cards
const dateFormat = (datePublished: any) => {
  const date = moment(datePublished);
  const formattedDate = date.format('MMMM D, YYYY h:mm A');
  return formattedDate;
}

// debounce function to prevent api calls on every keypress
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

// interface for news data
type NewsItem = {
  name: string;
  url: string;
  image: {
    thumbnail: {
      contentUrl: string;
    };
  };
  description: string;
  datePublished: string;
  provider: {
    name: string;
  }[];
};

export default function Home() {
  const [category, setCategory] = useState(''); // category for news
  const [searchQuery, setSearchQuery] = useState(""); // search query
  const debouncedQuery = useDebounce(searchQuery, 500); // 500 ms delay before search query is sent to API
  const [newsLoaded, setNewsLoaded] = useState(false); // api call loading state
  const [onHover, setOnHover] = useState(-1); // for hover effect on cards
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // page number for pagination using offset

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
    if (!e.target.value || !e.target.value.trim() || e.target.value.match(/[^a-zA-Z0-9 .,-]/)) {
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
      <p className="text-xl font-semibold">{(error as any).message}</p>
    </div>;
  }

  return (
    <>
      <Head>
        <title>NewsPulse</title>
        <meta name="description" content={`${process.env.NEXT_PUBLIC_SITE_NAME} - Get the latest news from around the world`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center w-full flex-1 px-5 md:px-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold">NewsPulse</h1>
          <p className="mt-3 text-[1.5rem] md:text-2xl font-medium" aria-label="description">
            Get the latest news from around the world
          </p>
          <div className="w-full md:w-5/12">
            <input
              type="text"
              placeholder="Search for news"
              className="w-full p-2 m-2 rounded-md border-2 border-slate-300 focus:outline-none focus:border-slate-500"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <ul className="flex flex-wrap justify-start items-center w-full sm:px-5 md:px-10 xl:px-20">
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
          {news.length === 0 && (
            <div className="text-center">
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
              <p className="text-xl font-semibold">No news found</p>
            </div>
          )}

          {news[0].name !== '' && (
            <div className="flex flex-col w-full sm:px-5 md:px-10 xl:px-20">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p className="text-xl font-semibold" aria-label="sort by">Page {page}</p>
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
                <div className="flex items-center">
                  <p className="text-xl font-semibold">Sort by</p>
                  <select
                    className="md:w-40 w-32 p-2 m-2 rounded-md border-2 border-slate-300 focus:outline-none focus:border-slate-500"
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

                <div className="flex items-center">
                  <p className="text-xl font-semibold">Freshness</p>
                  <select
                    className="md:w-40 w-32 p-2 m-2 rounded-md border-2 border-slate-300 focus:outline-none focus:border-slate-500"
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
                  <p className="text-xl font-semibold">Loading...</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {news.map((article, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setOnHover(index)}
                    onMouseLeave={() => setOnHover(-1)}
                    className={`flex flex-col rounded-md shadow-md ${onHover === index ? 'bg-slate-50 transform scale-105' : ''
                      }`}
                    aria-label={article.name}
                  >
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ImageBlur
                        // Displaying thumbnail because image quality is low for original image/high quality image article?.image?.thumbnail?.contentUrl.split('&')[0]
                        src={article?.image?.thumbnail?.contentUrl}
                        alt={article?.name}
                        topic={article?.name}
                      />
                    </a>
                    <div className="flex flex-col p-2 text-left">
                      <p className="text-sm text-slate-500"
                        aria-label="provider"
                      >{article.provider[0]?.name}</p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <h1 className="text-xl font-bold">{article?.name}</h1>
                      </a>
                      <p className="text-sm"
                        aria-label="description"
                      >{article.description}</p>
                      <p className="w-fit text-xs text-slate-500 mt-2"
                        aria-label="date published"
                      >{dateFormat(article.datePublished)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        {/* Saurav Hathi */}
        <footer className="flex items-center justify-center w-full h-24 border-t"
          aria-label="footer"
        >
          <a
            className="flex items-center justify-center"
            href="https://github.com/sauravhathi"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xl font-bold">Saurav Hathi</span>
          </a>
        </footer>
      </div>
    </>
  );
}

// Image component with blur effect while loading image and if image not available then display no image
const ImageBlur = (props: any) => {
  const { src, alt, topic } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      {src ? (
        <Image
          onLoadingComplete={() => setImageLoaded(true)}
          src={src}
          alt={alt}
          className={`w-full h-64 object-fit ${!imageLoaded ? 'animate-pulse bg-slate-100' : ''
            }`}
          width={1600}
          height={900}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-64 bg-slate-300">
          <span className="text-2xl font-bold">No Image</span>
        </div>
      )}
    </>
  );
};