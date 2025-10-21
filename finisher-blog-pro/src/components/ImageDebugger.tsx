'use client';

import { useState, useEffect } from 'react';

interface ImageDebuggerProps {
  src: string;
  alt: string;
}

const ImageDebugger = ({ src, alt }: ImageDebuggerProps) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!src) {
      setStatus('error');
      setErrorMessage('No image URL provided');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log('✅ Image loaded successfully:', src);
      setStatus('success');
    };
    
    img.onerror = (e) => {
      console.error('❌ Image failed to load:', src, e);
      setStatus('error');
      setErrorMessage('Failed to load image');
    };
    
    img.src = src;
  }, [src]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-center text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading image...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-center text-red-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">{errorMessage}</p>
          <p className="text-xs text-gray-500 mt-2 break-all">{src}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-64 object-cover rounded-lg"
      crossOrigin="anonymous"
    />
  );
};

export default ImageDebugger;