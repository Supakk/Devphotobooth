'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function FinalPhotosPage() {
  const router = useRouter();
  const { capturedImages, selectedLayout, mergedImage } = usePhotoBoothContext();
  
  useEffect(() => {
    if (!capturedImages || capturedImages.length === 0) {
      router.push('/select-feature');
    }
  }, [capturedImages, router]);
  
  // โค้ดสำหรับการแสดงภาพและแชร์
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation - เหมือนหน้าอื่น ๆ */}
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
      
      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Your Photos</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          {/* แสดงรูปภาพตาม layout ที่เลือก */}
          <div className="grid grid-cols-1 gap-4">
            {mergedImage && selectedLayout && (
              <div 
                className="relative mx-auto mt-4"
                style={{
                  width: `${selectedLayout.width}px`,
                  height: `${selectedLayout.height}px`,
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={mergedImage}
                  alt="Merged Layout Image"
                  width={selectedLayout.width}
                  height={selectedLayout.height}
                  className="object-contain"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Share Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}