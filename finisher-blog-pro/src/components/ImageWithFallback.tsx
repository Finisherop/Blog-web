'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  onError?: () => void;
}

const ImageWithFallback = ({ 
  src, 
  alt, 
  fill = false, 
  className = '', 
  priority = false,
  width,
  height,
  onError
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [useNextImage, setUseNextImage] = useState(true);

  const handleError = () => {
    if (useNextImage) {
      // Try with regular img tag
      setUseNextImage(false);
    } else {
      // Show placeholder
      setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE4NVYxMzVIMTc1VjEyNVoiIGZpbGw9IiM2QjcyODAiLz4KPHA+dGggZD0iTTE5NSAxMjVIMjI1VjEzNUgxOTVWMTI1WiIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTc1IDE0NUgxODVWMTU1SDE3NVYxNDVaIiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ik0xOTUgMTQ1SDIyNVYxNTVIMTk1VjE0NVoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+');
      onError?.();
    }
  };

  if (useNextImage) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={className}
        priority={priority}
        onError={handleError}
      />
    );
  }

  // Fallback to regular img tag
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} ${fill ? 'absolute inset-0 w-full h-full' : ''}`}
      onError={handleError}
      style={fill ? { objectFit: 'cover' } : {}}
      crossOrigin="anonymous"
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export default ImageWithFallback;