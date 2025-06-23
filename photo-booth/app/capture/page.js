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
      router.push('/choose-layout');
      return;
    }

    if (selectedLayout.slots && Array.isArray(selectedLayout.slots)) {
      setLayoutConfig({ photoCount: selectedLayout.slots.length });
  
      const width = typeof selectedLayout.width === 'string' 
        ? parseInt(selectedLayout.width) 
        : selectedLayout.width;
      const height = typeof selectedLayout.height === 'string' 
        ? parseInt(selectedLayout.height) 
        : selectedLayout.height;
  
      setContainerDimensions({ width, height });
    } else {
      setLayoutConfig({ photoCount: 1 });
    }
  
    setIsLoading(false);
  }, [selectedLayout, router]);

  const mergeCapturedWithOverlay = async () => {
    if (!previewRef.current) {
      setMergeError('Preview reference not found');
      return null;
    }

    setIsProcessing(true);
    setMergeError(null);

    try {
      // Wait for any pending DOM updates
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        allowTaint: true,
        imageTimeout: 15000,
      });

      const mergedImageURL = canvas.toDataURL('image/png', 0.9);
      setMergedImage(mergedImageURL);
      
      return mergedImageURL;
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
    if (updateContextImages) updateContextImages(newCapturedImages);

    // Auto-merge when all photos are captured
    if (newCapturedImages.length >= layoutConfig.photoCount) {
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
      if (updateContextImages) updateContextImages(newImages);
    }
  };

  const handleFilterSelect = (filter) => {
    console.log('Filter selected:', filter); // Debug log
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

  // Helper function to render photo slots
  const renderPhotoSlots = (scale) => {
    return selectedLayout?.slots?.map((slot, index) => (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: parseInt(slot.top) * scale,
          left: parseInt(slot.left) * scale,
          width: parseInt(slot.width) * scale,
          height: parseInt(slot.height) * scale,
          border: capturedImages[index] ? '1px solid black' : '1px dashed gray',
          overflow: 'hidden',
          zIndex: 5
        }}
      >
        {capturedImages[index] ? (
          <div className={`w-full h-full ${selectedFilter?.class || ''}`}>
            <Image
              src={capturedImages[index]}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover"
              unoptimized={true}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-10 text-black text-sm">
            {index + 1}
          </div>
        )}
      </div>
    ));
  };

  // Helper function to render layout overlay
  const renderLayoutOverlay = () => {
    if (!selectedLayout?.image) return null;
    
    return (
      <Image
        src={selectedLayout.image}
        alt={selectedLayout.name || 'Layout template'}
        fill
        className="object-contain"
        priority
        style={{ zIndex: 10 }}
        unoptimized={true}
      />
    );
  };

  // Helper function to render progress bar
  const renderProgressBar = (textSize = 'text-sm') => (
    <div className="mt-2 w-full">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-black h-2 rounded-full transition-all duration-300"
          style={{ width: `${(capturedImages.length / layoutConfig.photoCount) * 100}%` }}
        ></div>
      </div>
      <p className={`mt-1 text-center text-black ${textSize}`}>
        {capturedImages.length} / {layoutConfig.photoCount} {capturedImages.length === 1 ? 'Photo' : 'Photos'}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-6xl px-4">
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
        
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-md w-full">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Camera Section - Full Width */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Camera onCapture={handleImageCapture} selectedFilter={selectedFilter} />
              </div>
            </div>

            {/* Captured Images Gallery */}
            {capturedImages.length > 0 && (
              <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {capturedImages.map((image, index) => (
                    <div key={index} className="flex-shrink-0">
                      <div 
                        className="w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden bg-white"
                        style={{ minWidth: '80px', minHeight: '80px' }}
                      >
                        <div className={`w-full h-full ${selectedFilter?.class || ''}`}>
                          <Image
                            src={image}
                            alt={`Captured ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                            unoptimized={true}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress and Retake Section */}
            <div className="mb-4">
              {renderProgressBar('text-sm')}
              
              {capturedImages.length > 0 && (
                <button
                  onClick={handleRetake}
                  className="mt-3 w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                  disabled={isProcessing}
                >
                  Retake Last Photo
                </button>
              )}
            </div>

            {/* Filter Section - Full Width for Mobile */}
            <div className="mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h3 className="text-base font-semibold mb-3 text-black">Choose Filter</h3>
                <FilterSelector 
                  onSelect={handleFilterSelect} 
                  selectedFilter={selectedFilter}
                />
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex gap-2">
              {capturedImages.length === layoutConfig.photoCount && (
                <button
                  onClick={handleMergeNow}
                  className="flex-1 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors text-sm font-semibold"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'DONE'}
                </button>
              )}
            </div>

            {/* Hidden Preview for Merging */}
            <div className="hidden">
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
                {renderPhotoSlots(1)}
                {renderLayoutOverlay()}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:grid md:grid-cols-12 gap-6">
            {/* Filter Section */}
            <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-black">Choose Filter</h3>
              <FilterSelector 
                onSelect={handleFilterSelect} 
                selectedFilter={selectedFilter}
              />
              
              <div className="mt-6 space-y-3">
                {capturedImages.length === layoutConfig.photoCount && (
                  <button
                    onClick={handleMergeNow}
                    className="w-full py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Merge & Continue'}
                  </button>
                )}
              </div>
            </div>

            {/* Camera */}
            <div className="md:col-span-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <Camera onCapture={handleImageCapture} selectedFilter={selectedFilter} />
              </div>
            </div>

            {/* Preview */}
            <div className="md:col-span-3">
              <div className="p-3 flex flex-col items-center justify-center">
                <div
                  id="photo-preview-desktop"
                  ref={previewRef}
                  style={{
                    width: `${containerDimensions.width * 0.7}px`,
                    height: `${containerDimensions.height * 0.7}px`,
                    position: 'relative',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                  }}
                >
                  {renderPhotoSlots(0.7)}
                  {renderLayoutOverlay()}
                </div>

                {renderProgressBar()}

                {/* Retake Button under preview */}
                {capturedImages.length > 0 && (
                  <button
                    onClick={handleRetake}
                    className="mt-3 w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm"
                    disabled={isProcessing}
                  >
                    Retake Last Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}