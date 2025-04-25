'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Camera from '../../components/Camera';
import html2canvas from 'html2canvas';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function CapturePage() {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState([]);
  const { selectedLayout, setCapturedImages: updateContextImages, setMergedImage } = usePhotoBoothContext();
  const [layoutConfig, setLayoutConfig] = useState({ photoCount: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({ width: 300, height: 400 });
  const previewRef = useRef(null);

  useEffect(() => {
    if (!selectedLayout) {
      router.push('/choose-layout');
      return;
    }

    if (selectedLayout.slots && Array.isArray(selectedLayout.slots)) {
      setLayoutConfig({ photoCount: selectedLayout.slots.length });
      const maxWidth = 300;
      const maxHeight = 400;
      const scaleRatio = Math.min(
        maxWidth / selectedLayout.width,
        maxHeight / selectedLayout.height
      );
      setContainerDimensions({
        width: selectedLayout.width * scaleRatio,
        height: selectedLayout.height * scaleRatio
      });
    } else {
      setLayoutConfig({ photoCount: 1 });
    }

    setIsLoading(false);
  }, [selectedLayout, router]);

  const mergeCapturedWithOverlay = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      useCORS: true,
      backgroundColor: '#ffffff', // ป้องกันปัญหา transparent + oklch
      scale: 1,
    });

    const mergedImageURL = canvas.toDataURL('image/png');
    setMergedImage(mergedImageURL);
    localStorage.setItem('mergedImage', mergedImageURL);
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
        {/* พื้นหลัง */}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Capture Your Photos</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* กล้อง */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <Camera onCapture={handleImageCapture} />
                {capturedImages.length > 0 && (
                  <button
                    onClick={handleRetake}
                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors mt-2"
                  >
                  </button>
                )}
              </div>
            </div>

            {/* พรีวิว */}
            <div className="md:col-span-1">
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
                  {selectedLayout?.image && (
                    <Image
                      src={selectedLayout.image}
                      alt={selectedLayout.name || 'Layout template'}
                      fill
                      className="object-contain"
                      priority
                    />
                  )}

                  {selectedLayout?.slots?.map((slot, index) => {
                    const scaleRatio = containerDimensions.width / selectedLayout.width;
                    return (
                      <div
                        key={index}
                        style={{
                          position: 'absolute',
                          top: slot.top * scaleRatio,
                          left: slot.left * scaleRatio,
                          width: slot.width * scaleRatio,
                          height: slot.height * scaleRatio,
                          border: capturedImages[index] ? '2px solid black' : '2px dashed gray',
                          borderRadius: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        {capturedImages[index] ? (
                          <Image
                            src={capturedImages[index]}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
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
