'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Camera from '../../components/Camera';

export default function CapturePage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [layoutConfig, setLayoutConfig] = useState({ photoCount: 1 });
  
  useEffect(() => {
    // โหลด layout จาก localStorage
    const layout = localStorage.getItem('selectedLayout');
    setSelectedLayout(layout);
    
    // กำหนดจำนวนรูปที่ต้องถ่ายตาม layout
    if (layout === 'layout1') {
      setLayoutConfig({ photoCount: 1 });
    } else if (layout === 'layout2') {
      setLayoutConfig({ photoCount: 2 });
    } else if (layout === 'layout3') {
      setLayoutConfig({ photoCount: 4 });
    } else {
      setLayoutConfig({ photoCount: 1 });
    }
  }, []);

  const handleImageCapture = (imageData) => {
    const newCapturedImages = [...capturedImages, imageData];
    setCapturedImages(newCapturedImages);
    
    // ถ้าถ่ายครบตามจำนวนแล้วให้ไปหน้าต่อไป
    if (newCapturedImages.length >= layoutConfig.photoCount) {
      // เก็บรูปที่ถ่ายใน localStorage
      localStorage.setItem('capturedImages', JSON.stringify(newCapturedImages));
      router.push('/final-photos');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Capture Your Photos</h1>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <Camera onCapture={handleImageCapture} />
          </div>
          
          <div className="col-span-1">
            <div className="bg-gray-200 h-60 rounded-lg flex items-center justify-center">
              <span className="text-gray-600">Layout</span>
            </div>
            
            <div className="mt-6 flex justify-center">
              <span className="mr-4">
                {capturedImages.length} / {layoutConfig.photoCount} Photos
              </span>
              
              <button
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Take
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}