'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image'; // เพิ่ม import Image
import LayoutCarousel from '../../components/LayoutCarousel';

export default function ChooseLayoutPage() {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState(null);

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
  };

  const handleDone = () => {
    // เก็บ layout ที่เลือกใน localStorage หรือ context
    if (selectedLayout) {
      localStorage.setItem('selectedLayout', selectedLayout);
      router.push('/capture');
    } else {
      // เพิ่มการแจ้งเตือนให้ผู้ใช้เลือก layout
      alert('กรุณาเลือกเลย์เอาท์ก่อนดำเนินการต่อ');
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Choose your layout</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          <div className="mb-6">
            <LayoutCarousel onSelect={handleLayoutSelect} />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleDone}
              className={`px-6 py-2 rounded-md transition font-medium text-white ${
                selectedLayout ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedLayout}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}