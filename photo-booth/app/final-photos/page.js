'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function FinalPhotosPage() {
  const router = useRouter();
  const { capturedImages, selectedLayout, mergedImage } = usePhotoBoothContext(); // เพิ่ม mergedImage
  
  useEffect(() => {
    // ตรวจสอบทั้ง capturedImages และ mergedImage
    if ((!capturedImages || capturedImages.length === 0) && !mergedImage) {
      router.push('/select-feature');
    }
  }, [capturedImages, mergedImage, router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation - เหมือนหน้าอื่น ๆ */}
      <div className="area absolute inset-0 z-0 bg-white">
        {/* ... คงโค้ดเดิมไว้ ... */}
      </div>
      
      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Your Photos</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          {/* แสดงภาพที่รวมแล้ว */}
          {mergedImage && (
            <div className="w-full relative h-96 mb-6">
              <Image 
                src={mergedImage}
                fill
                alt="Your merged photo"
                className="object-contain"
                priority
              />
            </div>
          )}
          
          {/* แสดงรายการรูปภาพแต่ละรูป - คุณอาจต้องการซ่อนหรือแสดงตามต้องการ */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {capturedImages.map((image, index) => (
              <div key={index} className="w-full relative h-32">
                <Image 
                  src={image}
                  fill
                  alt={`Photo ${index + 1}`}
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => router.push('/select-feature')}
              className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Start Over
            </button>
            <button
              onClick={() => {
                // ดาวน์โหลดภาพที่รวมแล้ว
                if (mergedImage) {
                  const link = document.createElement('a');
                  link.href = mergedImage;
                  link.download = 'my-photobooth-picture.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Download Photo
            </button>
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Share Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}