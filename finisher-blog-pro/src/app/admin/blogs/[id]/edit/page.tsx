'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import AdminBlogForm from '@/components/AdminBlogForm';
import Loader from '@/components/Loader';
import { getBlog, updateBlog } from '@/lib/blogService';
import { CreateBlogData, Blog } from '@/types/blog';

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await getBlog(blogId);
        setBlog(blogData);
      } catch (error) {
        console.error('Error fetching blog:', error);
        router.push('/admin/blogs');
      } finally {
        setInitialLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId, router]);

  const handleSubmit = async (data: CreateBlogData) => {
    setLoading(true);
    try {
      const updateData = {
        ...data,
        topics: data.topics.map((topic: any) => ({
          ...topic,
          id: topic.id || crypto.randomUUID()
        }))
      };
      await updateBlog(blogId, updateData);
      router.push('/admin/blogs');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Error updating blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <AdminLayout title="Edit Blog">
        <Loader />
      </AdminLayout>
    );
  }

  if (!blog) {
    return (
      <AdminLayout title="Edit Blog">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Blog Not Found</h2>
          <p className="text-gray-300 mb-6">The blog you're trying to edit doesn't exist.</p>
          <button
            onClick={() => router.push('/admin/blogs')}
            className="neon-button"
          >
            Back to Blogs
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${blog.title}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AdminBlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Update Blog"
        />
      </motion.div>
    </AdminLayout>
  );
}