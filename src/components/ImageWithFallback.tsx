import React, { useState } from 'react';
import { LotusFlourish } from './BotanicalMotifs';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackTitle,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F8E9EE] text-[#111111] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <LotusFlourish className="w-20 h-7 mb-3" />
        <p className="font-serif text-base text-[#111111]">
          {fallbackTitle || alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
