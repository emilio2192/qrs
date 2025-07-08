"use client";
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: { url: string; alt?: string }[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  productName: string;
}

export default function ProductImageGallery({ images, selectedIndex, setSelectedIndex, productName }: ProductImageGalleryProps) {
  const mainImage = images[selectedIndex]?.url || '/placeholder.png';
  return (
    <div className="flex flex-row md:flex-col gap-4 items-start">
      <div className="flex flex-col gap-2 md:gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            className={`w-16 h-16 relative border rounded overflow-hidden focus:outline-none ${i === selectedIndex ? 'ring-2 ring-primary-500' : ''}`}
            onClick={() => setSelectedIndex(i)}
            aria-label={`Show image ${i + 1}`}
            type="button"
          >
            <Image src={img.url} alt={img.alt || productName} fill className="object-cover" />
          </button>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center min-w-[300px] min-h-[300px] md:min-w-[400px] md:min-h-[400px] relative">
        <Image src={mainImage} alt={productName} fill className="object-contain" />
      </div>
    </div>
  );
} 