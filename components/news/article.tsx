import { useState } from 'react'
import { NewsItem } from '../data/newsTypes'
import { dateFormat } from '../utility/dateFormat'
import ImageBlur from '../utility/imageBlur'

function Article({ news }: { news: NewsItem[] }) {
  const [onHover, setOnHover] = useState(-1)

  return (
    <article>
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
              src={article?.image?.thumbnail?.contentUrl}
              alt={article?.name}
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
              className="xl-b"
            >
              <h1>{article?.name}</h1>
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
    </article>
  )
}

export default Article