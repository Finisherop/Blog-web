'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TopicBlock from '@/components/TopicBlock';
import BlogCard from '@/components/BlogCard';
import Loader from '@/components/Loader';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Blog } from '@/types/blog';
import { getBlogBySlug, getRecentBlogs } from '@/lib/blogService';
import { trackPageView } from '@/lib/analytics';

export default function BlogPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogData = await getBlogBySlug(slug);
        setBlog(blogData);

        if (blogData) {
          // Track page view
          const hasVisited = localStorage.getItem(`visited-${blogData.id}`);
          const isUnique = !hasVisited;
          
          await trackPageView(blogData.id, isUnique);
          
          if (isUnique) {
            localStorage.setItem(`visited-${blogData.id}`, 'true');
          }
        }

        // Fetch related blogs (excluding current blog)
        const recentBlogs = await getRecentBlogs(16);
        const filtered = recentBlogs.filter(b => b.id !== blogData?.id).slice(0, 15);
        setRelatedBlogs(filtered);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog Not Found</h1>
          <p className="text-gray-300 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/" className="neon-button">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Banner */}
      <section className="relative h-[500px] overflow-hidden mt-8 rounded-2xl mx-4 sm:mx-6 lg:mx-8 bg-gray-800">
        <ImageWithFallback
          src={blog.headerImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300">
                <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Calendar size={18} />
                  <span className="text-sm font-medium">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Eye size={18} />
                  <span className="text-sm font-medium">{blog.views} views</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subheading */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-relaxed">
              {blog.subHeading}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* Blog Topics */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {blog.topics.map((topic, index) => (
            <TopicBlock
              key={topic.id}
              topic={topic}
              blogId={blog.id}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                Related Blogs
              </h2>
              <p className="text-gray-300 text-lg">
                Discover more amazing content
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}