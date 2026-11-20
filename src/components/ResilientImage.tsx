import {useState} from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function ResilientImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#070b18] via-[#111936] to-[#1a1033] p-6 text-center ${className}`}>
        <svg
          aria-hidden="true"
          viewBox="0 0 120 120"
          className="mb-3 h-16 w-16 text-cyan-300/60">
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <circle
            cx="60"
            cy="60"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <polygon
            points="60,18 96,60 60,102 24,60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="60" cy="60" r="4" fill="currentColor" />
        </svg>
        <span className="font-display text-xs tracking-widest text-slate-300 uppercase">
          Antariksha Rasa Orbital Visual
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
