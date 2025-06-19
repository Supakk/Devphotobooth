'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Camera from '../../components/Camera';
import html2canvas from 'html2canvas';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import FilterSelector from '../../components/FilterSelector';

export default function CapturePage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const { selectedLayout, setCapturedImages: updateContextImages, setMergedImage } = usePhotoBoothContext();
  const [layoutConfig, setLayoutConfig] = useState({ photoCount: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 400 });
  const previewRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState({ id: 'normal', name: 'Normal', class: '' });
  const [mergeError, setMergeError] = useState(null);

  useEffect(() => {
    if (!selectedLayout) {
      console.warn('No layout selected — redirecting to /choose-layout');
      router.push('/choose-layout');
      return;
    }

    console.log('📐 Selected Layout dimensions:', selectedLayout.width, selectedLayout.height);
    console.log('🧩 Slot Count:', selectedLayout.slots?.length);

    if (selectedLayout.slots && Array.isArray(selectedLayout.slots)) {
      setLayoutConfig({ photoCount: selectedLayout.slots.length });
  
      const width = typeof selectedLayout.width === 'string' 
        ? parseInt(selectedLayout.width) 
        : selectedLayout.width;
      const height = typeof selectedLayout.height === 'string' 
        ? parseInt(selectedLayout.height) 
        : selectedLayout.height;
  
      console.log('🧱 Set containerDimensions:', width, height);
  
      setContainerDimensions({
        width,
        height
      });
    } else {
      console.warn('⚠️ Layout has no valid slots array');
      setLayoutConfig({ photoCount: 1 });
    }
  
    setIsLoading(false);
  }, [selectedLayout, router]);

  // ปรับปรุงฟังก์ชันรวมรูปภาพ
  const mergeCapturedWithOverlay = async () => {
    if (!previewRef.current) {
      setMergeError('Preview reference not found');
      return null;
    }

    setIsProcessing(true);
    setMergeError(null);

    try {
      // ให้เวลาการ render ของ DOM สมบูรณ์ก่อนที่จะทำ canvas
      await new Promise(resolve => setTimeout(resolve, 300));

      // ปรับแต่งค่า html2canvas เพื่อคุณภาพที่ดีขึ้นและความน่าเชื่อถือ
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2, // สำหรับความคมชัดสูง
        logging: false, // ปิด logging เพื่อประสิทธิภาพ
        allowTaint: true,
        imageTimeout: 15000, // เพิ่มเวลาสำหรับโหลดรูปภาพ
        onclone: (clonedDoc) => {
          // สามารถทำการปรับแต่ง DOM ที่ clone ก่อนทำการ render ได้ที่นี่
          const clonedPreview = clonedDoc.querySelector('#photo-preview');
          if (clonedPreview) {
            // ตัวอย่างการปรับแต่ง clone ถ้าจำเป็น
            console.log('Preview cloned successfully');
          }
        }
      });

      // ปรับคุณภาพรูปภาพที่ export (0.9 คือค่าที่สมดุลระหว่างคุณภาพและขนาดไฟล์)
      const mergedImageURL = canvas.toDataURL('image/png', 0.9);
      
      // บันทึกลงใน context state
      setMergedImage(mergedImageURL);
      
      try {
        // ใช้ sessionStorage แทน localStorage และเพิ่มการตรวจสอบขนาด
        const imageSize = mergedImageURL.length * 2 / 1024 / 1024; // ประมาณขนาดเป็น MB
        console.log(`Merged image size: ~${imageSize.toFixed(2)}MB`);
        
        if (imageSize > 5) {
          console.warn('Image size is large, may have storage issues');
          // อาจจะลองลดขนาดถ้าจำเป็น
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          sessionStorage.setItem('mergedImage', compressedImage);
        } else {
          sessionStorage.setItem('mergedImage', mergedImageURL);
        }
        
        console.log("Merged image saved successfully");
        return mergedImageURL;
      } catch (e) {
        console.error("Error saving merged image to storage:", e);
        // ยังคง return รูปภาพเพื่อให้สามารถไปหน้าถัดไปได้แม้จะบันทึกไม่สำเร็จ
        return mergedImageURL;
      }
    } catch (error) {
      console.error("Error generating merged image:", error);
      setMergeError('Failed to generate merged image. Please try again.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageCapture = async (imageData) => {
    const newCapturedImages = [...capturedImages, imageData];
    setCapturedImages(newCapturedImages);

    // บันทึกรูปภาพที่ถ่ายล่าสุดลงใน localStorage
    try {
      localStorage.setItem('capturedImages', JSON.stringify(newCapturedImages));
      if (updateContextImages) updateContextImages(newCapturedImages);
    } catch (e) {
      console.error("Error saving captured images:", e);
    }

    if (newCapturedImages.length >= layoutConfig.photoCount) {
      // เมื่อถ่ายครบตามจำนวนแล้ว ทำการรวมรูปภาพ
      const merged = await mergeCapturedWithOverlay();
      if (merged) {
        router.push('/final-photos');
      }
    }
  };

  const handleRetake = () => {
    if (capturedImages.length > 0) {
      const newImages = capturedImages.slice(0, -1);
      setCapturedImages(newImages);
      
      // อัพเดต localStorage ด้วย
      try {
        localStorage.setItem('capturedImages', JSON.stringify(newImages));
        if (updateContextImages) updateContextImages(newImages);
      } catch (e) {
        console.error("Error updating captured images:", e);
      }
    }
  };

  const handleFilterSelect = (filter) => {
    console.log('🎨 Selected filter:', filter.name);
    setSelectedFilter(filter);
  };

  const handleMergeNow = async () => {
    if (capturedImages.length < layoutConfig.photoCount) {
      alert(`Please capture all ${layoutConfig.photoCount} photos first!`);
      return;
    }
    
    const merged = await mergeCapturedWithOverlay();
    if (merged) {
      router.push('/final-photos');
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-5xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Capture Your Photos</h1>
        
        {mergeError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Error:</strong> {mergeError}
          </div>
        )}
        
        {isProcessing && (
          <div className="bg-blue-100 border border-gray-600 text-black px-4 py-3 rounded mb-4 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
            Processing your photos... Please wait.
          </div>
        )}
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* เพิ่มส่วนของฟิลเตอร์ด้านซ้าย */}
            <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-black">Choose Filter</h3>
              <FilterSelector onSelect={handleFilterSelect} />
              
              <div className="mt-6 space-y-3">
                {capturedImages.length > 0 && (
                  <button
                    onClick={handleRetake}
                    className="w-full py-2 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                    disabled={isProcessing}
                  >
                    Retake Last Photo
                  </button>
                )}
                
                {capturedImages.length === layoutConfig.photoCount && (
                  <button
                    onClick={handleMergeNow}
                    className="w-full py-2 bg-pink-500 text-white rounded-md flex items-center justify-center hover:bg-pink-600 transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Merge & Continue'}
                  </button>
                )}
              </div>
            </div>

            {/* กล้อง - ส่งฟิลเตอร์ไปด้วย - ปรับให้มีขนาดใหญ่ขึ้น */}
            <div className="md:col-span-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Camera onCapture={handleImageCapture} selectedFilter={selectedFilter} />
              </div>
            </div>

            {/* พรีวิว */}
            <div className="md:col-span-3">
              <div className="p-3 flex flex-col items-center justify-center">
                <div
                  id="photo-preview"
                  ref={previewRef}
                  style={{
                    width: `${containerDimensions.width}px`,
                    height: `${containerDimensions.height}px`,
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                  }}
                >
                  {console.log('🖼️ Rendering preview container:', containerDimensions)}

                  {selectedLayout?.slots?.map((slot, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          position: 'absolute',
                          top: slot.top,
                          left: slot.left,
                          width: slot.width,
                          height: slot.height,
                          border: capturedImages[index] ? '2px solid black' : '2px dashed gray',
                          borderRadius: 0,
                          overflow: 'hidden',
                          zIndex: 5
                        }}
                      >
                        {capturedImages[index] ? (
                          <div className={`w-full h-full ${selectedFilter.class}`}>
                            <Image
                              src={capturedImages[index]}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized={true} // เพื่อให้แน่ใจว่า Next.js ไม่ปรับแต่งรูปภาพ
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              color: '#000',
                              fontSize: '18px',
                            }}
                          >
                            {index + 1}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {selectedLayout?.image && (
                    <Image
                      src={selectedLayout.image}
                      alt={selectedLayout.name || 'Layout template'}
                      fill
                      className="object-contain"
                      priority
                      style={{ zIndex: 10 }}
                      unoptimized={true} // เพื่อให้แน่ใจว่า Next.js ไม่ปรับแต่งรูปภาพ
                    />
                  )}
                </div>
              </div>
              <div className="mt-4 text-black">
                <p className="text-sm font-semibold mb-2">Progress:</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-black h-2.5 rounded-full transition-all"
                    style={{ width: `${(capturedImages.length / layoutConfig.photoCount) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-center text-black text-sm">
                  {capturedImages.length} / {layoutConfig.photoCount} Photos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}