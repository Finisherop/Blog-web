'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Eye } from 'lucide-react';
import { Blog } from '@/types/blog';

interface BlogCardProps {
  blog: Blog;
  index?: number;
}

const BlogCard = ({ blog, index = 0 }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full"
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        <article className="glass-card overflow-hidden hover:shadow-2xl hover:shadow-blue-400/30 transition-all duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2 h-full flex flex-col border border-white/10">
          {/* Blog Image */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={blog.headerImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              priority={index < 4}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* View Count Badge */}
            <div className="absolute top-4 right-4 glass-card px-3 py-1.5 flex items-center space-x-2 backdrop-blur-md">
              <Eye size={14} className="text-blue-400" />
              <span className="text-xs text-white font-medium">{blog.views}</span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="p-6 flex-1 flex flex-col">
            <header className="mb-4">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 leading-tight line-clamp-2">
                {blog.title}
              </h3>
              
              <p className="text-gray-300 line-clamp-3 leading-relaxed">
                {blog.subHeading}
              </p>
            </header>

            {/* Meta Information */}
            <footer className="mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar size={14} />
                  <span className="font-medium">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="text-blue-400 font-semibold group-hover:text-blue-300 transition-colors duration-300">
                  Read More →
                </div>
              </div>
            </footer>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default BlogCard;