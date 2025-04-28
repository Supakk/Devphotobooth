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

  // ฟังก์ชันสำหรับดาวน์โหลดรูปภาพ
  const handleDownload = () => {
    if (!mergedImage) return;
    
    // สร้าง link element
    const link = document.createElement('a');
    
    // ตั้งชื่อไฟล์ที่จะดาวน์โหลด
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `photobooth-${timestamp}.png`;
    
    // กำหนด url ของรูปภาพ (mergedImage เป็น base64 string)
    link.href = mergedImage;
    
    // ซ่อน link และเพิ่มเข้าไปใน DOM
    link.style.display = 'none';
    document.body.appendChild(link);
    
    // จำลองการคลิกเพื่อเริ่มการดาวน์โหลด
    link.click();
    
    // ลบ link ออกจาก DOM เมื่อดาวน์โหลดเสร็จสิ้น
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  };
  
  // โค้ดสำหรับการแสดงภาพและแชร์
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
                  overflow: 'hidden',
                  borderRadius: 0, // ตรงกับที่กำหนดใน CapturePage
                }}
              >
                <Image
                  src={mergedImage}
                  alt="Merged Layout Image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleDownload}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}