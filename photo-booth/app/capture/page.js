'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react'; // เพิ่ม useRef
import Image from 'next/image';
import Camera from '../../components/Camera';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import html2canvas from 'html2canvas'; // ต้องติดตั้ง npm install html2canvas

export default function CapturePage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const { 
    selectedLayout, 
    setCapturedImages: updateContextImages,
    setMergedImage // เพิ่มสำหรับเก็บภาพที่รวมกับ layout แล้ว
  } = usePhotoBoothContext();
  const [layoutConfig, setLayoutConfig] = useState({ photoCount: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 400 });
  const previewRef = useRef(null); // เพิ่ม ref สำหรับ element ที่จะเอามาแปลงเป็นรูปภาพ
  
  // คงโค้ดส่วน useEffect และอื่นๆ เดิมไว้

  // เพิ่มฟังก์ชันสำหรับการรวมภาพและ layout เข้าด้วยกัน
  const mergeImagesWithLayout = async () => {
    if (!previewRef.current) return null;
    
    try {
      setIsLoading(true);
      
      // ใช้ html2canvas เพื่อแปลง DOM element เป็นรูปภาพ
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, // เพิ่มความละเอียด
      });
      
      // แปลง canvas เป็น URL รูปภาพ
      const mergedImageURL = canvas.toDataURL('image/png');
      
      // อัปเดต context เพื่อส่งไปยังหน้า final-photos
      if (setMergedImage) {
        setMergedImage(mergedImageURL);
      }
      
      setIsLoading(false);
      return mergedImageURL;
    } catch (error) {
      console.error('Error merging images:', error);
      setIsLoading(false);
      return null;
    }
  };

  const handleImageCapture = (imageData) => {
    const newCapturedImages = [...capturedImages, imageData];
    setCapturedImages(newCapturedImages);
    
    // ถ้าถ่ายครบตามจำนวนแล้ว
    if (newCapturedImages.length >= layoutConfig.photoCount) {
      // เก็บรูปที่ถ่ายใน localStorage และ context
      localStorage.setItem('capturedImages', JSON.stringify(newCapturedImages));
      
      // อัปเดต context
      if (updateContextImages) {
        updateContextImages(newCapturedImages);
      }
      
      // รอเล็กน้อยให้ UI เรนเดอร์ภาพครบก่อนแล้วค่อยรวมภาพ
      setTimeout(async () => {
        await mergeImagesWithLayout();
        router.push('/final-photos');
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation - แบบเดิม */}
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
            {/* Camera Section */}
            <div className="md:col-span-1">
              <Camera onCapture={handleImageCapture} />
            </div>
            
            {/* Preview Section */}
            <div className="md:col-span-1">
              <div className="rounded-lg p-3 flex flex-col items-center justify-center">
                <div 
                  ref={previewRef} // เพิ่ม ref ตรงนี้
                  className="relative rounded-lg overflow-hidden mx-auto border border-gray-200 shadow-sm"
                  style={{
                    width: `${containerDimensions.width}px`, 
                    height: `${containerDimensions.height}px`,
                    maxWidth: '100%',
                    maxHeight: '65vh'
                  }}
                >
                  {/* Layout Background */}
                  {selectedLayout?.image && (
                    <Image
                      src={selectedLayout.image}
                      alt={selectedLayout.name || "Layout template"}
                      fill
                      className="object-contain"
                      priority
                    />
                  )}

                  {/* Preview รูปที่ถ่าย */}
                  {selectedLayout?.slots?.map((slot, index) => {
                    // คำนวณอัตราส่วนของ container เทียบกับขนาดจริงของ layout
                    const scaleRatio = containerDimensions.width / selectedLayout.width;
                    
                    return (
                      <div
                        key={index}
                        className={`absolute border-2 ${capturedImages[index] ? 'border-transparent' : 'border-white border-dashed'} rounded-md overflow-hidden`} // เปลี่ยนเป็น border-transparent เมื่อมีรูปแล้ว
                        style={{
                          top: slot.top * scaleRatio,
                          left: slot.left * scaleRatio,
                          width: slot.width * scaleRatio,
                          height: slot.height * scaleRatio,
                        }}
                      >
                        {capturedImages[index] ? (
                          <Image
                            src={capturedImages[index]}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover" // ใช้ object-cover สำหรับรูปถ่ายเพื่อให้เต็มช่อง
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white bg-black bg-opacity-25">
                            <span>{index + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* ... คงโค้ดเดิมไว้ ... */}
              </div>
            </div>
          </div>
          
          {capturedImages.length >= layoutConfig.photoCount && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={async () => {
                  await mergeImagesWithLayout();
                  router.push('/final-photos');
                }}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                View All Photos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}