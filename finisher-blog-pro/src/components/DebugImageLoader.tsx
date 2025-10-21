'use client';

import { useState, useEffect } from 'react';

interface DebugImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

const DebugImageLoader = ({ src, alt, className = '' }: DebugImageLoaderProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [actualSrc, setActualSrc] = useState(src);

  useEffect(() => {
    console.log('DebugImageLoader: Attempting to load image:', src);
    setStatus('loading');
    setActualSrc(src);
  }, [src]);

  const handleLoad = () => {
    console.log('DebugImageLoader: Image loaded successfully:', src);
    setStatus('loaded');
  };

  const handleError = () => {
    console.log('DebugImageLoader: Image failed to load:', src);
    setStatus('error');
    // Try with a different approach - direct URL without Next.js optimization
    if (actualSrc === src) {
      setActualSrc(src + '?direct=true');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <img
        src={actualSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
      
      {/* Debug overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded">
          Status: {status}
          <br />
          URL: {actualSrc.substring(0, 50)}...
        </div>
      )}
      
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-400">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Image failed to load</p>
            <p className="text-xs mt-1 opacity-75">Check console for details</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugImageLoader;