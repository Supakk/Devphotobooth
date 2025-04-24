'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import LayoutCarousel from '../../components/LayoutCarousel';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import { Toast } from '../../components/Toast'; // Assuming you'll create this component

export default function ChooseLayoutPage() {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState(null);
  const { selectedFeature, setSelectedLayout: setContextLayout } = usePhotoBoothContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setContextLayout(layout);
  };

  // Effect for adjusting container size based on content
  useEffect(() => {
    if (!contentRef.current || !containerRef.current) return;
    
    // Use ResizeObserver for more reliable measurements
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === contentRef.current) {
          const contentWidth = contentRef.current.offsetWidth;
          containerRef.current.style.width = `${contentWidth + 16}px`; // Add padding
        }
      }
    });

    resizeObserver.observe(contentRef.current);
    
    // Initially set the size
    const contentWidth = contentRef.current.offsetWidth;
    containerRef.current.style.width = `${contentWidth + 16}px`;
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [selectedLayout]); 

  const handleDone = () => {
    if (selectedLayout) {
      // Use context value instead of localStorage directly
      // Store to localStorage if needed for persistence
      setContextLayout(selectedLayout);
      
      // Navigate based on context value, not localStorage
      if (selectedFeature === 'camera') {
        router.push('/capture');
      } else if (selectedFeature === 'gallery') {
        router.push('/upload');
      } else {
        router.push('/select-feature');
      }
    } else {
      // Replace alert with custom toast
      setToastMessage('Please select a layout before proceeding');
      setShowToast(true);
    }
  };

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
            { src: "/image/Badtz-Maru.png", alt: "Badtz-Maru" },
            { src: "/image/Pochacco.png", alt: "Pochacco" },
          ].map((item, index) => (
            <li key={index} className="relative">
              <Image 
                src={item.src}  
                alt={item.alt} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain" 
                priority={index < 2}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Choose your layout</h1>
        
        <div ref={containerRef} className="mx-auto bg-gray-100 p-2 rounded-xl shadow-md">
          <div ref={contentRef} className="mb-4">
            <LayoutCarousel onSelect={handleLayoutSelect} />
          </div>
          
          {!selectedLayout && (
            <p className="text-center text-gray-600 mb-4">
              Please select a layout to continue
            </p>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleDone}
              className={`px-12 py-3 rounded-full font-medium text-white transition-colors ${
                selectedLayout ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedLayout}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Toast notification component */}
      {showToast && (
        <Toast 
          message={toastMessage}
          onClose={() => setShowToast(false)}
          type="warning"
        />
      )}
    </div>
  );
}