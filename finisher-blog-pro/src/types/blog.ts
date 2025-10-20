export interface BlogTopic {
  id: string;
  image?: string;
  title: string;
  content: string;
  buttonEnabled: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface Blog {
  id: string;
  headerImage: string;
  subHeading: string;
  createdAt: Date;
  topics: BlogTopic[];
  views: number;
  ctrClicks: number;
  title: string;
  metaDescription?: string;
  slug: string;
}

export interface CreateBlogData {
  headerImage: string;
  subHeading: string;
  topics: Omit<BlogTopic, 'id'>[];
  title: string;
  metaDescription?: string;
  slug: string;
}