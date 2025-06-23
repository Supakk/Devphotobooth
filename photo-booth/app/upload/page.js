'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import html2canvas from 'html2canvas';

export default function UploadPage() {
  const router = useRouter();
  const { selectedLayout, setCapturedImages, setMergedImage } = usePhotoBoothContext();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const previewRef = useRef(null);

  // Initialize slots based on selected layout
  useEffect(() => {
    if (!selectedLayout) {
      router.push('/choose-layout');
      return;
    }

    const slotsCount = selectedLayout.slots.length;
    setUploadedImages(new Array(slotsCount).fill(null));
    setPreviewUrls(new Array(slotsCount).fill(''));
  }, [selectedLayout, router]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const newUploadedImages = [...uploadedImages];
      newUploadedImages[index] = file;
      setUploadedImages(newUploadedImages);
      
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const newPreviewUrls = [...previewUrls];
        newPreviewUrls[index] = e.target.result;
        setPreviewUrls(newPreviewUrls);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const newUploadedImages = [...uploadedImages];
    const newPreviewUrls = [...previewUrls];
    
    newUploadedImages[index] = null;
    newPreviewUrls[index] = '';
    
    setUploadedImages(newUploadedImages);
    setPreviewUrls(newPreviewUrls);
  };

  const mergeCapturedWithOverlay = async () => {
    if (!previewRef.current) return null;

    setIsProcessing(true);
    try {
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
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = async () => {
    const allSlotsHaveImages = uploadedImages.every(image => image !== null);
    
    if (allSlotsHaveImages) {
      setCapturedImages(previewUrls);
      const merged = await mergeCapturedWithOverlay();
      if (merged) {
        router.push('/final-photos');
      }
    } else {
      alert('Please upload images for all slots!');
    }
  };

  const getResponsiveLayoutSize = () => {
    if (!selectedLayout) return { width: 300, height: 400 };
    
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const maxWidth = viewportWidth < 640 ? Math.min(280, viewportWidth - 40) : 
                     viewportWidth < 1024 ? 350 : selectedLayout.width;
    
    if (selectedLayout.width <= maxWidth) {
      return { width: selectedLayout.width, height: selectedLayout.height };
    }
    
    const aspectRatio = selectedLayout.width / selectedLayout.height;
    const scaledWidth = maxWidth;
    const scaledHeight = scaledWidth / aspectRatio;
    
    return { width: scaledWidth, height: scaledHeight };
  };

  const responsiveSize = getResponsiveLayoutSize();
  const scale = responsiveSize.width / selectedLayout?.width || 1;

  if (!selectedLayout) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const completedPhotos = previewUrls.filter(url => url !== '').length;
  const totalPhotos = selectedLayout.slots.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      <BackgroundCircles />
      
      <div className="relative z-10 w-full max-w-6xl px-4 py-4 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
          Upload Your Photos
        </h1>
        
        {isProcessing && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 mx-4 flex items-center text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600 mr-2"></div>
            Processing your photos...
          </div>
        )}
        
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Upload Controls */}
          <div className="bg-white p-4 rounded-lg shadow-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>
            <div className="space-y-3">
              {selectedLayout.slots.map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {previewUrls[index] ? (
                    <div className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-16 h-16 relative">
                        <Image 
                          src={previewUrls[index]}
                          fill
                          alt={`Preview ${index + 1}`}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
                        disabled={isProcessing}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-16 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="text-sm text-gray-500">Choose photo</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                        disabled={isProcessing}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
            
            {/* Progress */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{completedPhotos}/{totalPhotos}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedPhotos / totalPhotos) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!uploadedImages.every(img => img !== null) || isProcessing}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed mt-4 transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Continue to Final Photos'}
            </button>
          </div>

          {/* Layout Preview */}
          <div className="bg-white p-4 rounded-lg shadow-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="flex justify-center">
              <div 
                id="photo-preview"
                ref={previewRef}
                className="relative" 
                style={{ 
                  width: `${responsiveSize.width}px`, 
                  height: `${responsiveSize.height}px`,
                  backgroundColor: '#ffffff',
                  border: '1px solid #ccc',
                  overflow: 'hidden',
                }}
              >
                {selectedLayout.slots.map((slot, index) => (
                  <div 
                    key={index}
                    className="absolute"
                    style={{
                      top: `${slot.top * scale}px`,
                      left: `${slot.left * scale}px`,
                      width: `${slot.width * scale}px`,
                      height: `${slot.height * scale}px`,
                      border: previewUrls[index] ? '1px solid black' : '1px dashed gray',
                      overflow: 'hidden',
                      zIndex: 5
                    }}
                  >
                    {previewUrls[index] ? (
                      <Image
                        src={previewUrls[index]}
                        fill
                        alt={`Preview ${index + 1}`}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600">
                        {index + 1}
                      </div>
                    )}
                  </div>
                ))}
                
                {selectedLayout.image && (
                  <Image
                    src={selectedLayout.image}
                    fill
                    alt={selectedLayout.name || 'Layout template'}
                    className="object-contain"
                    priority
                    style={{ zIndex: 10 }}
                    unoptimized
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Layout Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Layout Preview</h2>
            <div className="flex justify-center">
              <div 
                id="photo-preview"
                ref={previewRef}
                className="relative" 
                style={{ 
                  width: `${selectedLayout.width}px`, 
                  height: `${selectedLayout.height}px`,
                  maxWidth: '100%',
                  backgroundColor: '#ffffff',
                  border: '1px solid #ccc',
                  overflow: 'hidden',
                }}
              >
                {selectedLayout.slots.map((slot, index) => (
                  <div 
                    key={index}
                    className="absolute"
                    style={{
                      top: `${slot.top}px`,
                      left: `${slot.left}px`,
                      width: `${slot.width}px`,
                      height: `${slot.height}px`,
                      border: previewUrls[index] ? '2px solid black' : '2px dashed gray',
                      overflow: 'hidden',
                      zIndex: 5
                    }}
                  >
                    {previewUrls[index] ? (
                      <Image
                        src={previewUrls[index]}
                        fill
                        alt={`Preview ${index + 1}`}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-lg">
                        {index + 1}
                      </div>
                    )}
                  </div>
                ))}
                
                {selectedLayout.image && (
                  <Image
                    src={selectedLayout.image}
                    fill
                    alt={selectedLayout.name || 'Layout template'}
                    className="object-contain"
                    priority
                    style={{ zIndex: 10 }}
                    unoptimized
                  />
                )}
              </div>
            </div>
            
            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{completedPhotos}/{totalPhotos} Photos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-black h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(completedPhotos / totalPhotos) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Photos</h2>
            <div className="space-y-4">
              {selectedLayout.slots.map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  {previewUrls[index] ? (
                    <div className="flex-1 flex flex-col items-center space-y-2">
                      <div className="w-20 h-20 relative">
                        <Image 
                          src={previewUrls[index]}
                          fill
                          alt={`Preview ${index + 1}`}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100 transition-colors"
                        disabled={isProcessing}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-20 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="text-sm text-gray-500">Choose photo</span>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, index)}
                        disabled={isProcessing}
                      />
                    </label>
                  )}
                </div>
              ))}
              
              <button
                onClick={handleContinue}
                disabled={!uploadedImages.every(img => img !== null) || isProcessing}
                className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed mt-6 transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Continue to Final Photos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}