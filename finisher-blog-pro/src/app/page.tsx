'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BlogCard from '@/components/BlogCard';
import Loader from '@/components/Loader';
import { Blog } from '@/types/blog';
import { getRecentBlogs } from '@/lib/blogService';

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const recentBlogs = await getRecentBlogs(16);
        setBlogs(recentBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Welcome to{' '}
            <span className="gradient-text">Finisher Blog Pro</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Discover amazing content, insights, and stories from our professional blog platform.
            Built with cutting-edge technology for the best reading experience.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button 
              onClick={() => {
                const blogsSection = document.getElementById('blogs-section');
                blogsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="neon-button text-lg px-8 py-4"
            >
              Explore Blogs
            </button>
          </motion.div>
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section id="blogs-section" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              Recent Blog Posts
            </h2>
            <p className="text-gray-300 text-lg">
              Stay updated with our latest insights and stories
            </p>
          </motion.div>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {blogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="glass-card p-12 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">No Blogs Yet</h3>
                <p className="text-gray-300 mb-6">
                  Be the first to create amazing content on Finisher Blog Pro!
                </p>
                <Link href="/admin/login" className="neon-button inline-block">
                  Create Your First Blog
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}