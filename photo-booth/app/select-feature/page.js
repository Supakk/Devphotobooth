'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function SelectFeaturePage() {
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const { setSelectedFeature: setContextFeature } = usePhotoBoothContext();

  const handleSelect = (feature) => {
    setSelectedFeature(feature);
    setContextFeature?.(feature); // ใช้ optional chaining เพื่อป้องกัน error

    localStorage.setItem('selectedFeature', feature);
    router.push('/choose-layout');    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 sm:px-6 relative overflow-hidden">
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
            { src: "/image/Badtz-Maru.png", alt: "Hello Kitty" },
            { src: "/image/Pochacco.png", alt: "Pochacco" },
          ].map((item, index) => (
            <li key={index} className="relative">
              <Image 
                src={item.src}  
                fill 
                alt={item.alt} 
                className="object-contain" 
                priority={index < 2}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="z-10 flex flex-col items-center justify-center w-full px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-black">
          Please select the feature you want.
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-xl z-10">
        <div className="bg-gray-200 p-4 sm:p-6 rounded-lg shadow-md text-center w-full flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-4">
          <h2 className="text-sm sm:text-base font-semibold text-black text-center">
            Take a photo 
          </h2>
          <div className="mb-2 sm:mb-4 flex justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
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
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition font-medium text-base min-w-24"
          >
            Select
          </button>
        </div>
          
        <div className="bg-gray-200 p-4 sm:p-6 rounded-lg shadow-md text-center w-full flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-4">
          <h2 className="text-sm sm:text-base font-semibold text-black text-center">
            Upload photo 
          </h2>
          <div className="mb-2 sm:mb-4 flex justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
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
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition font-medium text-base min-w-24"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}