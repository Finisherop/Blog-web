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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blog/${blog.slug}`}>
        <div className="glass-card overflow-hidden hover:shadow-lg hover:shadow-blue-400/20 transition-all duration-300 group-hover:scale-105">
          {/* Blog Image */}
          <div className="relative h-48 overflow-hidden">
            <Image
              src={blog.headerImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* View Count Badge */}
            <div className="absolute top-4 right-4 glass-card px-2 py-1 flex items-center space-x-1">
              <Eye size={14} className="text-blue-400" />
              <span className="text-xs text-white">{blog.views}</span>
            </div>
          </div>

          {/* Blog Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
              {blog.title}
            </h3>
            
            <p className="text-gray-300 mb-4 line-clamp-2">
              {blog.subHeading}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="text-blue-400 font-medium">
                Read More →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;