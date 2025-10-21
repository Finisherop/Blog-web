'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, X, Plus, Save, Eye, EyeOff } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateBlogData, BlogTopic } from '@/types/blog';
import { generateSlug } from '@/lib/blogService';
import AdminTopicEditor from './AdminTopicEditor';

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subHeading: z.string().min(1, 'Subheading is required'),
  metaDescription: z.string().optional(),
  headerImage: z.string().min(1, 'Header image is required'),
  topics: z.array(z.object({
    title: z.string().min(1, 'Topic title is required'),
    content: z.string().min(1, 'Topic content is required'),
    image: z.string().optional(),
    buttonEnabled: z.boolean(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
  })).min(1, 'At least one topic is required')
});

type BlogFormData = z.infer<typeof blogSchema>;

interface AdminBlogFormProps {
  initialData?: Partial<CreateBlogData>;
  onSubmit: (data: CreateBlogData) => Promise<void>;
  loading?: boolean;
  submitText?: string;
}

const AdminBlogForm = ({ 
  initialData, 
  onSubmit, 
  loading = false,
  submitText = 'Create Blog'
}: AdminBlogFormProps) => {
  const [headerImagePreview, setHeaderImagePreview] = useState(initialData?.headerImage || '');

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      subHeading: initialData?.subHeading || '',
      metaDescription: initialData?.metaDescription || '',
      headerImage: initialData?.headerImage || '',
      topics: initialData?.topics || [{
        title: '',
        content: '',
        image: '',
        buttonEnabled: false,
        buttonText: '',
        buttonLink: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'topics'
  });

  const watchTitle = watch('title');

  const handleHeaderImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('headerImage', url);
    setHeaderImagePreview(url);
  };

  const removeHeaderImage = () => {
    setHeaderImagePreview('');
    setValue('headerImage', '');
  };

  const addTopic = () => {
    append({
      title: '',
      content: '',
      image: '',
      buttonEnabled: false,
      buttonText: '',
      buttonLink: ''
    });
  };

  const onFormSubmit = async (data: BlogFormData) => {
    const slug = generateSlug(data.title);
    await onSubmit({
      ...data,
      slug,
      topics: data.topics.map(topic => ({
        ...topic,
        id: crypto.randomUUID()
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Blog Title *
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter blog title"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
            {watchTitle && (
              <p className="text-gray-400 text-sm mt-1">
                Slug: {generateSlug(watchTitle)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subheading *
            </label>
            <input
              {...register('subHeading')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter subheading"
            />
            {errors.subHeading && (
              <p className="text-red-400 text-sm mt-1">{errors.subHeading.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Meta Description (SEO)
          </label>
          <textarea
            {...register('metaDescription')}
            rows={3}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Enter meta description for SEO (optional)"
          />
        </div>
      </div>

      {/* Header Image */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-6">Header Image</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL *
            </label>
            <div className="relative">
              <input
                {...register('headerImage')}
                onChange={handleHeaderImageUrlChange}
                className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
              <Link size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {errors.headerImage && (
              <p className="text-red-400 text-sm mt-1">{errors.headerImage.message}</p>
            )}
          </div>
          
          {headerImagePreview && (
            <div className="relative">
              <img
                src={headerImagePreview}
                alt="Header preview"
                className="w-full h-64 object-cover rounded-lg"
                onError={() => setHeaderImagePreview('')}
              />
              <button
                type="button"
                onClick={removeHeaderImage}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Topics */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Blog Topics</h2>
          <button
            type="button"
            onClick={addTopic}
            className="neon-button flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Topic</span>
          </button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <AdminTopicEditor
              key={field.id}
              index={index}
              register={register}
              control={control}
              errors={errors}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
        </div>

        {errors.topics && (
          <p className="text-red-400 text-sm mt-2">{errors.topics.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="neon-button flex items-center space-x-2 px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={20} />
          )}
          <span>{loading ? 'Saving...' : submitText}</span>
        </button>
      </div>
    </form>
  );
};

export default AdminBlogForm;