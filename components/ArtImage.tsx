import Image from 'next/image';

interface ArtImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ArtImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: ArtImageProps) {
  if (!src) {
    return (
      <div className={`relative w-full h-full bg-[#24362B] flex items-center justify-center ${containerClassName}`}>
        <span className="text-[10px] text-[#A6BAAD] font-mono uppercase tracking-widest">
          Sans Image
        </span>
      </div>
    );
  }

  const isBase64 = src.startsWith('data:');

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      <Image
        src={src}
        alt={alt || "Œuvre d'art"}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isBase64}
        className={`object-cover object-center transition-transform duration-500 ease-out ${className}`}
      />
    </div>
  );
}