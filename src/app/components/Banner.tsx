import { Banner as BannerType } from '../../types/api';

interface BannerProps {
  banner: BannerType;
}

export default function Banner({ banner }: BannerProps) {
  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${banner.imageUrl})` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-start h-full px-6 md:px-12 lg:px-16">
        <div className="max-w-2xl">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {banner.title}
          </h1>
          
          {/* Subtitle */}
          {banner.subtitle && (
            <h2 className="text-lg md:text-xl text-white mb-4 opacity-90">
              {banner.subtitle}
            </h2>
          )}
          
          {/* Description */}
          {banner.description && (
            <p className="text-white mb-6 opacity-80">
              {banner.description}
            </p>
          )}
          
          
        </div>
      </div>
    </div>
  );
} 