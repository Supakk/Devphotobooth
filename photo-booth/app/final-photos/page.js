'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function FinalPhotosPage() {
  const router = useRouter();
  const { capturedImages, selectedLayout, mergedImage, setMergedImage } = usePhotoBoothContext();
  const [localMergedImage, setLocalMergedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!selectedLayout) {
      console.warn('No layout selected - redirecting to choose-layout');
      router.push('/choose-layout');
      return;
    }

    if (!capturedImages || capturedImages.length === 0) {
      console.warn('No captured images - redirecting to choose-layout');
      router.push('/choose-layout');
      return;
    }

    // ถ้ามีรูปภาพที่รวมแล้วใน context ให้ใช้มัน
    if (mergedImage) {
      setLocalMergedImage(mergedImage);
      setIsLoading(false);
      return;
    }

    // ถ้าไม่มี mergedImage ใน context ให้ลองโหลดจาก sessionStorage
    try {
      const storedMergedImage = sessionStorage.getItem('mergedImage');
      if (storedMergedImage) {
        console.log('Found merged image in sessionStorage');
        setLocalMergedImage(storedMergedImage);
        // อัพเดต context ด้วย
        if (setMergedImage) {
          setMergedImage(storedMergedImage);
        }
      } else {
        console.warn('No merged image found in storage, redirecting');
        router.push('/capture');
      }
    } catch (error) {
      console.error('Error loading merged image from storage:', error);
    }
    
    setIsLoading(false);
  }, [capturedImages, router, selectedLayout, mergedImage, setMergedImage]);

  // ฟังก์ชันสำหรับดาวน์โหลดรูปภาพ
  const handleDownload = () => {
    const imageToDownload = mergedImage || localMergedImage;
    if (!imageToDownload) {
      console.error('No image available to download');
      return;
    }
    
    const link = document.createElement('a');
    
    // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `photobooth-${timestamp}.png`;
    link.href = imageToDownload;
    
    // ซ่อน link และเพิ่มเข้าไปใน DOM
    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  const displayImage = mergedImage || localMergedImage;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
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
              sizes="(max-width: 320px) 80px, (max-width: 480px) 100px, (max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, (max-width: 1280px) 180px, (max-width: 1536px) 200px, 220px"
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
            {displayImage && selectedLayout ? (
              <div 
                className="relative mx-auto mt-4"
                style={{
                  width: `${selectedLayout.width}px`,
                  height: `${selectedLayout.height}px`,
                  border: '1px solid #ccc',
                  overflow: 'hidden',
                  borderRadius: 0, 
                  maxWidth: '100%',
                  maxHeight: '70vh'
                }}
              >
                <Image
                  src={displayImage}
                  alt="Your Photo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="text-center p-4 text-red-500">
                ไม่พบรูปภาพ กรุณาถ่ายรูปก่อน
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleDownload}
              disabled={!displayImage}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Photos
            </button>
            
            <button
              onClick={() => router.push('/capture')}
              className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors"
            >
              Take New Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}