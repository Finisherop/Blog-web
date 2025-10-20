import { Metadata } from 'next';
import { getBlogBySlug } from '@/lib/blogService';

interface BlogLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const blog = await getBlogBySlug(params.slug);
    
    if (!blog) {
      return {
        title: 'Blog Not Found - Finisher Blog Pro',
        description: 'The requested blog post could not be found.',
      };
    }

    return {
      title: `${blog.title} - Finisher Blog Pro`,
      description: blog.metaDescription || blog.subHeading,
      keywords: `blog, ${blog.title}, finisher blog pro`,
      authors: [{ name: 'Finisher Blog Pro' }],
      openGraph: {
        title: blog.title,
        description: blog.metaDescription || blog.subHeading,
        type: 'article',
        images: [
          {
            url: blog.headerImage,
            width: 1200,
            height: 630,
            alt: blog.title,
          },
        ],
        publishedTime: blog.createdAt.toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.metaDescription || blog.subHeading,
        images: [blog.headerImage],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog - Finisher Blog Pro',
      description: 'Professional blog content on Finisher Blog Pro',
    };
  }
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return <>{children}</>;
}