'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PhotoPreview from '../../components/PhotoPreview';
import FilterSelector from '../../components/FilterSelector';

export default function FinalPhotosPage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  
  useEffect(() => {
    // โหลดรูปภาพและ layout จาก localStorage
    const images = JSON.parse(localStorage.getItem('capturedImages') || '[]');
    const layout = localStorage.getItem('selectedLayout');
    
    setCapturedImages(images);
    setSelectedLayout(layout);
  }, []);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
  };

  const handleDownload = () => {
    // สร้างลิงก์ดาวน์โหลดรูปภาพ
    const canvas = document.getElementById('final-photo-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'photobooth-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Your final photos</h1>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1">
            <PhotoPreview 
              images={capturedImages}
              layout={selectedLayout}
              filter={selectedFilter}
            />
          </div>
          
          <div className="col-span-1">
            <h2 className="text-lg font-semibold mb-4">Choose your Filter</h2>
            <FilterSelector onSelect={handleFilterSelect} />
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDownload}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
