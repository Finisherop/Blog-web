'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, Trash2, Link, Image as ImageIcon } from 'lucide-react';
import { Control, UseFormRegister, FieldErrors } from 'react-hook-form';

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
  canRemove,
}: AdminTopicEditorProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const removeImage = () => {
    setImageUrl('');
    const input = document.querySelector(
      `input[name="topics.${index}.image"]`
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
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
        {errors.topics &&
          Array.isArray(errors.topics) &&
          errors.topics[index]?.title && (
            <p className="text-red-400 text-sm mt-1">
              {errors.topics[index]?.title?.message}
            </p>
          )}
      </div>

      {/* Topic Image (via URL) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic Image URL (Optional)
        </label>
        <div className="flex flex-col space-y-3">
          <input
            {...register(`topics.${index}.image`)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            onChange={(e) => setImageUrl(e.target.value)}
          />

          {imageUrl && (
            <div className="relative mt-2">
              <img
                src={imageUrl}
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
            </div>
          )}

          {!imageUrl && (
            <div className="border border-dashed border-white/20 rounded-lg p-6 text-center text-gray-400">
              <ImageIcon size={28} className="mx-auto mb-2 opacity-60" />
              <p>Enter a valid image URL above to preview</p>
            </div>
          )}
        </div>
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
        {errors.topics &&
          Array.isArray(errors.topics) &&
          errors.topics[index]?.content && (
            <p className="text-red-400 text-sm mt-1">
              {errors.topics[index]?.content?.message}
            </p>
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
            onClick={() => {
              const newState = !buttonEnabled;
              setButtonEnabled(newState);
              const input = document.querySelector(
                `input[name="topics.${index}.buttonEnabled"]`
              ) as HTMLInputElement;
              if (input) {
                input.value = newState.toString();
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
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
                <Link
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminTopicEditor;