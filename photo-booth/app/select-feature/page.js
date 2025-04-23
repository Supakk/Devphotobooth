'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function SelectFeaturePage() {
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleSelect = (feature) => {
    setSelectedFeature(feature);
    router.push('/choose-layout');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation */}
        <div className="area absolute inset-0 z-0 bg-white">
          <ul className="circles">
            {[
              { src: "/image/kitty.png", alt: "Hello Kitty" },
              { src: "/image/hangyodon.jpg", alt: "Hangyodon" },
              { src: "/image/Tuxedo.png", alt: "Tuxedo Sam" },
              { src: "/image/mymelody.png", alt: "My Melody" },
              { src: "/image/littletwinstar.png", alt: "Little Twin Stars" },
              { src: "/image/keroppi.png", alt: "Keroppi" },
              { src: "/image/chococat.png", alt: "Chococat" },
              { src: "/image/kuromi.png", alt: "Kuromi" },
              { src: "/image/kitty.png", alt: "Hello Kitty" },
              { src: "/image/Pochacco.png", alt: "Pochacco" },
            ].map((item, index) => (
              <li key={index} className="relative">
                <Image 
                  src={item.src}  
                  fill 
                  alt={item.alt} 
                  className="object-contain" 
                  priority={index < 2} // ให้ความสำคัญกับรูปภาพแรกๆ
                />
              </li>
            ))}
          </ul>
        </div>

      <h1 className="text-3xl md:text-4xl font-semibold text-black mb-8 md:mb-12 lg:mb-20 text-center">Please select the feature you want.</h1>
        
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-200 p-6 md:p-4 rounded-lg shadow-md text-center w-full max-w-xs md:max-w-sm lg:max-w-md flex flex-col items-center justify-center gap-4 md:gap-6">
        <h2 className="text-xs md:text-sm font-semibold text-black text-center">
          Take a photo 
        </h2>
          <div className="mb-4 flex justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
              <Image
                src="/image/Logocamera.png" 
                fill 
                alt="Photo Booth Icon" 
                className="object-cover"
              />
            </div>
          </div>
          <button
            onClick={() => handleSelect('camera')}
            className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-gray-800 transition font-medium text-sm md:text-base"
          >
            Select
          </button>
        </div>
          
        <div className="bg-gray-200 p-6 md:p-8 rounded-lg shadow-md text-center w-full max-w-xs md:max-w-sm lg:max-w-md flex flex-col items-center justify-center gap-4 md:gap-6">
        <h2 className="text-xs md:text-sm font-semibold text-black text-center">
          upload photo 
        </h2>
          <div className="mb-4 flex justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
              <Image
                src="/image/Logoupload.png" 
                fill 
                alt="Photo Booth Icon" 
                className="object-cover"
              />
            </div>
          </div>
          <button
            onClick={() => handleSelect('gallery')}
            className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-gray-800 transition font-medium text-sm md:text-base"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}