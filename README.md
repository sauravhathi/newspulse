# NewsPulse

NewsPulse is a news website built using Nextjs, reactjs, tailwindcss, bing news api and node-cache. It displays top news articles from various categories, allows users to search news articles by keyword and filter news articles by category.

**Note:** For reducing the number of API calls, I have used node-cache to cache the API response for 1 hour. So, if you are not getting the latest news articles, please wait for 1 hour or reload the page.

## Demo

### [https://newspulse.vercel.app/](https://newspulse.vercel.app/)

![image](https://user-images.githubusercontent.com/61316762/226770596-cd05aebb-a645-4da3-b1ec-208bb10c8e2e.png)

![image](https://user-images.githubusercontent.com/61316762/226770611-626ec4c3-784d-400c-9c8b-4fee9d6b8cea.png)

## Features

- Top news articles from various categories
- Search news articles by keyword
- Filter news articles by category
- Pagination
- Sort news articles by date
- Responsive design

## Tech Stack

 **Client:** Next.js, React, TailwindCSS, Axios(for API calls) and Node-Cache(for caching)

## Run Locally

Clone the project

  ```bash
  git clone https://github.com/sauravhathi/newspulse.git
```

Go to the project directory

  ```bash
  cd newspulse
```

Install dependencies

  ```bash
  npm install
```

Start the server

  ```bash
  npm run dev
```

## Methods

#### Debounce

  ```javascript
const debounce = (func, delay) => {
  let inDebounce;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
};
```

#### Get news articles

  ```javascript
export const getNews = async (category, sort, page) => {
  const res = await axios.get(
    `/news/search?q=${category || searchQuery}&sortby=${sort}&offset=${page*10}&count=10`,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_BING_NEWS_API,
      },
    }
  );
  return res.data;
};
```
## API Reference

#### Get top news articles

  ```http
  GET /news/search/
```

| Parameter | Type | Description |
| : -------- | : ------- | : ------------------------- |
| `q` | `string` | **Required**. Search query |
| `sortby` | `string` | **Required**. Sort by date |
| `offset` | `number` | **Required**. Offset |
| `freshness` | `string` | **Required**. Freshness |
| `headlinecount` | `number` | **Required**. Headline count |

#### Get news articles by keyword

  ```http
  GET /news/search?q=${keyword}
```

#### Get news articles by category and sort by date

  ```http
  GET /news/search?q=${category}&sortby=${sort}
```

#### Get news articles by category and sort by date and pagination

  ```http
  GET /news/search?q=${category}&sortby=${sort}&offset=${page*10}&count=10
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`NEXT_PUBLIC_BING_NEWS_API = 'YOUR_BING_NEWS_API_KEY'`
`NEXT_PUBLIC_SITE_NAME = 'YOUR_SITE_NAME'`

## Authors

- [@sauravhathi](https://www.github.com/sauravhathi)
