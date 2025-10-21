'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, Trash2, Link } from 'lucide-react';
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
  canRemove 
}: AdminTopicEditorProps) => {
  const [imagePreview, setImagePreview] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  
  // Initialize button enabled state from form data
  useEffect(() => {
    const checkButtonState = () => {
      const input = document.querySelector(`input[name="topics.${index}.buttonEnabled"]`) as HTMLInputElement;
      if (input && input.value) {
        setButtonEnabled(input.value === 'true');
      }
    };
    
    // Check initial state and set up observer
    checkButtonState();
    const interval = setInterval(checkButtonState, 100);
    
    return () => clearInterval(interval);
  }, [index]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    console.log(`Topic ${index} image URL changed:`, url);
    setImagePreview(url);
    // Update the hidden input value
    const hiddenInput = document.querySelector(`input[name="topics.${index}.image"]`) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = url;
      hiddenInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const removeImage = () => {
    setImagePreview('');
    const input = document.querySelector(`input[name="topics.${index}.image"]`) as HTMLInputElement;
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    // Also clear the URL input field
    const urlInput = document.querySelector(`input[name="topics.${index}.imageUrl"]`) as HTMLInputElement;
    if (urlInput) {
      urlInput.value = '';
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
        {errors.topics && Array.isArray(errors.topics) && errors.topics[index]?.title && (
          <p className="text-red-400 text-sm mt-1">{errors.topics[index]?.title?.message}</p>
        )}
      </div>

      {/* Topic Image */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic Image (Optional)
        </label>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              name={`topics.${index}.imageUrl`}
              onChange={handleImageUrlChange}
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <Link size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Topic preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={() => setImagePreview('')}
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
        </div>
        
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
        {errors.topics && Array.isArray(errors.topics) && errors.topics[index]?.content && (
          <p className="text-red-400 text-sm mt-1">{errors.topics[index]?.content?.message}</p>
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
              // Update the hidden input
              const input = document.querySelector(`input[name="topics.${index}.buttonEnabled"]`) as HTMLInputElement;
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