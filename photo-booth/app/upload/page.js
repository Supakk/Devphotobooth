'use client';

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
  const [mergeError, setMergeError] = useState(null);
  const previewRef = useRef(null);

  // Check if layout is selected, if not redirect back
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
      // Update the specific index with the new file
      const newUploadedImages = [...uploadedImages];
      newUploadedImages[index] = file;
      setUploadedImages(newUploadedImages);
      
      // Create and set the preview URL
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
    if (!previewRef.current) {
      setMergeError('Preview reference not found');
      return null;
    }

    setIsProcessing(true);
    setMergeError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        allowTaint: true,
        imageTimeout: 15000,
        onclone: (clonedDoc) => {
          const clonedPreview = clonedDoc.querySelector('#photo-preview');
          if (clonedPreview) {
            console.log('Preview cloned successfully');
          }
        }
      });

      const mergedImageURL = canvas.toDataURL('image/png', 0.9);
      
      setMergedImage(mergedImageURL);
      
      try {
        const imageSize = mergedImageURL.length * 2 / 1024 / 1024;  
        console.log(`Merged image size: ~${imageSize.toFixed(2)}MB`);
        
        if (imageSize > 5) {
          console.warn('Image size is large, may have storage issues');
          const compressedImage = canvas.toDataURL('image/jpeg', 0.7);
          sessionStorage.setItem('mergedImage', compressedImage);
        } else {
          sessionStorage.setItem('mergedImage', mergedImageURL);
        }
        
        console.log("Merged image saved successfully");
        return mergedImageURL;
      } catch (e) {
        console.error("Error saving merged image to storage:", e);
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

  // คำนวณขนาดสำหรับ responsive
  const getResponsiveLayoutSize = () => {
    if (!selectedLayout) return { width: 300, height: 400 };
    
    // ขนาดสูงสุดสำหรับแต่ละ breakpoint
    const maxWidths = {
      mobile: 280,
      tablet: 350,
      desktop: selectedLayout.width
    };
    
    const aspectRatio = selectedLayout.width / selectedLayout.height;
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    
    let maxWidth;
    if (viewportWidth < 640) { // mobile
      maxWidth = Math.min(maxWidths.mobile, viewportWidth - 40);
    } else if (viewportWidth < 1024) { // tablet
      maxWidth = maxWidths.tablet;
    } else { // desktop
      maxWidth = maxWidths.desktop;
    }
    
    if (selectedLayout.width <= maxWidth) {
      return { width: selectedLayout.width, height: selectedLayout.height };
    }
    
    const scaledWidth = maxWidth;
    const scaledHeight = scaledWidth / aspectRatio;
    
    return { width: scaledWidth, height: scaledHeight };
  };

  const responsiveSize = getResponsiveLayoutSize();
  const scale = responsiveSize.width / selectedLayout?.width || 1;

  if (!selectedLayout) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation */}
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
      
      <div className="relative z-10 w-full max-w-7xl px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-black mb-4 sm:mb-6">
          Upload Your Photos
        </h1>

        {mergeError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4 text-sm">
            <strong>Error:</strong> {mergeError}
          </div>
        )}
        
        {isProcessing && (
          <div className="bg-blue-100 border border-gray-600 text-black px-4 py-3 rounded mb-4 mx-4 flex items-center text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
            Processing your photos... Please wait.
          </div>
        )}
        
        {/* Mobile Layout - Stack vertically */}
        <div className="lg:hidden space-y-4">
          {/* Upload Controls - Show first on mobile */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md mx-4">
            <h2 className="text-base font-semibold mb-3">Upload Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {selectedLayout.slots.map((_, index) => (
                <div key={`upload-${index}`} className="rounded-md">
                  {previewUrls[index] ? ( 
                    <div className="space-y-2">
                      <div className="w-full aspect-square relative">
                        <Image 
                          src={previewUrls[index]}
                          fill
                          alt={`Preview ${index + 1}`}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="w-full py-1 px-2 bg-red-50 text-red-600 rounded-md text-xs hover:bg-red-100"
                        disabled={isProcessing}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-square cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center text-center p-2">
                        <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="text-xs text-gray-500">Photo {index + 1}</span>
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
            
            {/* Progress Bar */}
            <div className="mt-3 text-black">
              <p className="text-sm font-semibold mb-2">Progress:</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all"
                  style={{ width: `${(previewUrls.filter(url => url !== '').length / selectedLayout.slots.length) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-center text-black text-sm">
                {previewUrls.filter(url => url !== '').length} / {selectedLayout.slots.length} Photos
              </p>
            </div>

            <button
              onClick={handleContinue}
              disabled={!uploadedImages.every(img => img !== null) || isProcessing}
              className="w-full py-2.5 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed mt-3"
            >
              {isProcessing ? 'Processing...' : 'Continue to Final Photos'}
            </button>
          </div>

          {/* Layout Preview */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md mx-4">
            <h2 className="text-base font-semibold mb-3">Preview</h2>
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
                {/* ช่องใส่รูปตามเลย์เอาท์ */}
                {selectedLayout.slots.map((slot, index) => (
                  <div 
                    key={`slot-${index}`}
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
                        unoptimized={true}
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
                          fontSize: `${12 * scale}px`,
                        }}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Layout overlay image */}
                {selectedLayout.image && (
                  <Image
                    src={selectedLayout.image}
                    fill
                    alt={selectedLayout.name || 'Layout template'}
                    className="object-contain"
                    priority
                    style={{ zIndex: 10 }}
                    unoptimized={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-2">
          {/* Layout Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Layout Preview</h2>
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
                {/* ช่องใส่รูปตามเลย์เอาท์ */}
                {selectedLayout.slots.map((slot, index) => (
                  <div 
                    key={`slot-${index}`}
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
                        unoptimized={true}
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
                ))}
                
                {/* Layout overlay image */}
                {selectedLayout.image && (
                  <Image
                    src={selectedLayout.image}
                    fill
                    alt={selectedLayout.name || 'Layout template'}
                    className="object-contain"
                    priority
                    style={{ zIndex: 10 }}
                    unoptimized={true}
                  />
                )}
              </div>
            </div>
            
            <div className="mt-4 text-black">
              <p className="text-sm font-semibold mb-2">Progress:</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-black h-2.5 rounded-full transition-all"
                  style={{ width: `${(previewUrls.filter(url => url !== '').length / selectedLayout.slots.length) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-center text-black text-sm">
                {previewUrls.filter(url => url !== '').length} / {selectedLayout.slots.length} Photos
              </p>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upload Photos</h2>
            <div className="space-y-4 ">
              {selectedLayout.slots.map((_, index) => (
                <div key={`upload-${index}`} className="rounded-md p-4 flex justify-center">
                  {previewUrls[index] ? ( 
                    <div className="mb-3">
                      <div className="w-full h-24 relative">
                        <Image 
                          src={previewUrls[index]}
                          fill
                          alt={`Preview ${index + 1}`}
                          className="object-cover rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="mt-2 px-3 py-1 bg-red-50 text-red-600 rounded-md text-sm hover:bg-red-100"
                        disabled={isProcessing}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-24 w-48 cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center text-center">
                        <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span className="text-sm text-gray-500">Upload photo</span>
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
                className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
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