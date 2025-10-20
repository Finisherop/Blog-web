'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/AdminLayout';
import AdminBlogForm from '@/components/AdminBlogForm';
import { createBlog } from '@/lib/blogService';
import { CreateBlogData } from '@/types/blog';

export default function CreateBlog() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateBlogData) => {
    setLoading(true);
    try {
      const blogId = await createBlog(data);
      router.push(`/admin/blogs/${blogId}/edit`);
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Error creating blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Create New Blog">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <AdminBlogForm
          onSubmit={handleSubmit}
          loading={loading}
          submitText="Create Blog"
        />
      </motion.div>
    </AdminLayout>
  );
}