'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Eye, EyeOff, Trash2, Link } from 'lucide-react';
import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { uploadImage } from '@/lib/blogService';

interface AdminTopicEditorProps {
  index: number;
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: FieldErrors<any>;
  onRemove: () => void;
  canRemove: boolean;
}

const AdminTopicEditor = ({ 
  index, 
  register, 
  control, 
  errors, 
  onRemove, 
  canRemove 
}: AdminTopicEditorProps) => {
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);

    try {
      const imageUrl = await uploadImage(file, `blogs/topics/${Date.now()}_${file.name}`);
      // Update the form value through register
      const input = document.querySelector(`input[name="topics.${index}.image"]`) as HTMLInputElement;
      if (input) {
        input.value = imageUrl;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (error) {
      console.error('Error uploading topic image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    const input = document.querySelector(`input[name="topics.${index}.image"]`) as HTMLInputElement;
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-white/10 rounded-lg p-6 space-y-6"
    >
      {/* Topic Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Topic {index + 1}</h3>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Topic Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic Title *
        </label>
        <input
          {...register(`topics.${index}.title`)}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Enter topic title"
        />
        {errors.topics?.[index]?.title && (
          <p className="text-red-400 text-sm mt-1">{(errors.topics as any)?.[index]?.title?.message}</p>
        )}
      </div>

      {/* Topic Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic Image (Optional)
        </label>
        
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Topic preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
            >
              <X size={16} />
            </button>
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors duration-200"
          >
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-300 text-sm">Click to upload image</p>
          </div>
        )}
        
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        
        <input
          {...register(`topics.${index}.image`)}
          type="hidden"
        />
      </div>

      {/* Topic Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic Content *
        </label>
        <textarea
          {...register(`topics.${index}.content`)}
          rows={6}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          placeholder="Enter topic content (HTML supported)"
        />
        {errors.topics?.[index]?.content && (
          <p className="text-red-400 text-sm mt-1">{(errors.topics as any)?.[index]?.content?.message}</p>
        )}
        <p className="text-gray-500 text-sm mt-1">
          You can use HTML tags for formatting (e.g., &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;)
        </p>
      </div>

      {/* CTR Button Settings */}
      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-300">
            Call-to-Action Button
          </label>
          <button
            type="button"
            onClick={() => setButtonEnabled(!buttonEnabled)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
              buttonEnabled 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-400/50' 
                : 'bg-gray-500/20 text-gray-400 border border-gray-400/50'
            }`}
          >
            {buttonEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
            <span>{buttonEnabled ? 'Enabled' : 'Disabled'}</span>
          </button>
        </div>

        <input
          {...register(`topics.${index}.buttonEnabled`)}
          type="hidden"
          value={buttonEnabled.toString()}
        />

        {buttonEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Button Text
              </label>
              <input
                {...register(`topics.${index}.buttonText`)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="e.g., Learn More"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Button Link
              </label>
              <div className="relative">
                <input
                  {...register(`topics.${index}.buttonLink`)}
                  className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="https://example.com"
                />
                <Link size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminTopicEditor;