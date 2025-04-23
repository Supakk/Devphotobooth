'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Camera from '../../components/Camera';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function CapturePage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const { selectedLayout } = usePhotoBoothContext();
  const [layoutConfig, setLayoutConfig] = useState({ photoCount: 1 });
  
  useEffect(() => {
    if (!selectedLayout) {
      router.push('/choose-layout');
      return;
    }
    
    // กำหนดจำนวนรูปที่ต้องถ่ายตาม layout
    if (selectedLayout === 'layout1') {
      setLayoutConfig({ photoCount: 3 });
    } else if (selectedLayout === 'layout2') {  
      setLayoutConfig({ photoCount: 2 });
    } else if (selectedLayout === 'layout3') {
      setLayoutConfig({ photoCount: 4 });
    } else if (selectedLayout === 'layout4') {
      setLayoutConfig({ photoCount: 1 });
    } else {
      setLayoutConfig({ photoCount: 1 });
    }
  }, [selectedLayout, router]);

  const handleImageCapture = (imageData) => {
    const newCapturedImages = [...capturedImages, imageData];
    setCapturedImages(newCapturedImages);
    
    // ถ้าถ่ายครบตามจำนวนแล้วให้ไปหน้าต่อไป
    if (newCapturedImages.length >= layoutConfig.photoCount) {
      // เก็บรูปที่ถ่ายใน localStorage และ context
      localStorage.setItem('capturedImages', JSON.stringify(newCapturedImages));
      
      // ถ้ามีการใช้ context
      if (typeof window !== 'undefined' && usePhotoBoothContext) {
        const { setCapturedImages: updateContextImages } = usePhotoBoothContext();
        if (updateContextImages) {
          updateContextImages(newCapturedImages);
        }
      }
      
      router.push('/final-photos');
    }
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Capture Your Photos</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <Camera onCapture={handleImageCapture} />
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-gray-200 h-60 rounded-lg flex items-center justify-center">
                <span className="text-gray-600">Layout</span>
              </div>
              
              <div className="mt-6 flex justify-center">
                <span className="mr-4">
                  {capturedImages.length} / {layoutConfig.photoCount} Photos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}