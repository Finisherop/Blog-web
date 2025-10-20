'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Search,
  MousePointer
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Blog } from '@/types/blog';
import { getAllBlogs, deleteBlog } from '@/lib/blogService';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const allBlogs = await getAllBlogs();
      setBlogs(allBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (deleteConfirm !== blogId) {
      setDeleteConfirm(blogId);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await deleteBlog(blogId);
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog. Please try again.');
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.subHeading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Manage Blogs">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Manage Blogs">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          
          <Link href="/admin/blogs/create" className="neon-button flex items-center space-x-2">
            <Plus size={20} />
            <span>Create New Blog</span>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Blogs</p>
                <p className="text-2xl font-bold text-white">{blogs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">
                  {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Eye size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Clicks</p>
                <p className="text-2xl font-bold text-white">
                  {blogs.reduce((sum, blog) => sum + (blog.ctrClicks || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <MousePointer size={24} className="text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card overflow-hidden hover:shadow-lg hover:shadow-blue-400/10 transition-all duration-300"
              >
                {/* Blog Image */}
                <div className="relative h-48">
                  <Image
                    src={blog.headerImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Stats Overlay */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <div className="glass-card px-2 py-1 flex items-center space-x-1">
                      <Eye size={14} className="text-blue-400" />
                      <span className="text-xs text-white">{blog.views || 0}</span>
                    </div>
                    <div className="glass-card px-2 py-1 flex items-center space-x-1">
                      <MousePointer size={14} className="text-purple-400" />
                      <span className="text-xs text-white">{blog.ctrClicks || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {blog.subHeading}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center text-xs text-gray-400 mb-4">
                    <Calendar size={12} className="mr-1" />
                    <span>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{blog.topics.length} topics</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      <Link
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>

                    <button
                      onClick={() => handleDelete(blog.id)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        deleteConfirm === blog.id
                          ? 'text-red-300 bg-red-500/20 hover:bg-red-500/30'
                          : 'text-red-400 hover:text-red-300 hover:bg-red-500/20'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {deleteConfirm === blog.id && (
                    <p className="text-red-300 text-xs mt-2">
                      Click again to confirm deletion
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="glass-card p-12 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? 'No blogs found' : 'No blogs yet'}
              </h3>
              <p className="text-gray-300 mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create your first blog to get started'
                }
              </p>
              {!searchTerm && (
                <Link href="/admin/blogs/create" className="neon-button">
                  Create Your First Blog
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}