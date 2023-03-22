export interface NewsItem {
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
  }
  