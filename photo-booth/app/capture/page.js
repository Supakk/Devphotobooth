'use client';

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
  const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 400 });
  const previewRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState({ id: 'normal', name: 'Normal', class: '' });

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

  const mergeCapturedWithOverlay = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 2,
      logging: true,
      allowTaint: true,
    });

    const mergedImageURL = canvas.toDataURL('image/png', 0.8); // ลดคุณภาพลงเล็กน้อยเพื่อลดขนาด
    setMergedImage(mergedImageURL);
    
    try {
      // ใช้ sessionStorage แทน localStorage
      sessionStorage.setItem('mergedImage', mergedImageURL);
      console.log("Merged image saved successfully");
    } catch (e) {
      console.error("Error saving merged image:", e);
      // แบ่งเก็บภาพเป็นส่วนๆ หากขนาดใหญ่เกินไป
      // หรือเลือกที่จะไม่เก็บแต่สร้างใหม่ตอนต้องการใช้
    }
    
    return mergedImageURL;
  };

  const handleImageCapture = async (imageData) => {
    const newCapturedImages = [...capturedImages, imageData];
    setCapturedImages(newCapturedImages);

    if (newCapturedImages.length >= layoutConfig.photoCount) {
      localStorage.setItem('capturedImages', JSON.stringify(newCapturedImages));
      if (updateContextImages) updateContextImages(newCapturedImages);

      const merged = await mergeCapturedWithOverlay();
      if (merged) {
        router.push('/final-photos');
      }
    }
  };

  const handleRetake = () => {
    if (capturedImages.length > 0) {
      setCapturedImages(capturedImages.slice(0, -1));
    }
  };

  const handleFilterSelect = (filter) => {
    console.log('🎨 Selected filter:', filter.name);
    setSelectedFilter(filter);
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

      <div className="relative z-10 w-full max-w-5xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Capture Your Photos</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* เพิ่มส่วนของฟิลเตอร์ด้านซ้าย */}
            <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-black">Choose Filter</h3>
              <FilterSelector onSelect={handleFilterSelect} />
              
              {capturedImages.length > 0 && (
                <button
                  onClick={handleRetake}
                  className="mt-6 w-full py-2 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  Retake Last Photo
                </button>
              )}
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
                    />
                  )}
                </div>

                <div className="mt-4 text-black text-sm">
                  {capturedImages.length} / {layoutConfig.photoCount} Photos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}