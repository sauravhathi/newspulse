import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react'
import { NewsItem } from '@/components/data/newsTypes';
import Article from '@/components/news/article';
import Footer from '@/components/footer/footer';
import Search from '@/components/search/serach';
import Category from '@/components/category/category';
import Pagination from '@/components/pagination/pagination';
import SortBy from '@/components/sortBy/sortBy';
import Freshness from '@/components/freshness/freshness';
import { options } from '@/components/data/options';
import LoadingSpinner from '@/components/utility/loadingSpinner';
import NoFound from '@/components/utility/noFound';
import { useDebounce } from '@/components/utility/useDebounce';
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

  // fetch news from bing news api using axios and endpoint in proxy server in next.config.js
  const fetchNews = async () => {
    setNewsLoaded(true);
    const cacheKey = `news-${category}-${searchQuery}-${page}-${sort}-${freshness}`;
    const cachedData: NewsItem[] | undefined = cache.get(cacheKey);
    if (cachedData) {
      setNews(cachedData);
      setNewsLoaded(false);
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
      setEmpty(res.data.value.length === 0);
      setNewsLoaded(false);
      cache.set(cacheKey, res.data.value, 60 * 60); // Cache for 1 hour
    } catch (err: any) {
      setError(err);
      setNewsLoaded(false);
    }
  };

  /* eslint-disable no-use-before-define */
  let useeffectcalled = false;
  // useEffect to fetch news on initial render and when category, page, sort, freshness, searchQuery changes
  useEffect(() => {
    if (!useeffectcalled) {
      useeffectcalled = true;
      console.log("Made with ❤️ by @sauravhathi");
      fetchNews();
    }
  }, [useeffectcalled, debouncedQuery, category, page, sort, freshness]);

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
          <Search
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {news.length > 1 && (
            <div className="flex flex-col w-full sm:px-5 md:px-10 xl:px-20">
              <Category
                category={category}
                categories={options.categories}
                setCategory={setCategory}
                setSearchQuery={setSearchQuery}
                setPage={setPage}
                setSort={setSort}
                setFreshness={setFreshness}
              />

              <div className="flex-wc justify-between">
                <Pagination
                  setPage={setPage}
                  page={page}
                />
                <SortBy
                  setSort={setSort}
                  sort={sort}
                  sortBy={options.sortBy}
                />
                <Freshness
                  setFreshness={setFreshness}
                  freshness={freshness}
                  freshnessCat={options.freshness}
                />
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
        <Footer />
      </div>
    </>
  );
}