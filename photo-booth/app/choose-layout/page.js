'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import LayoutCarousel from '../../components/LayoutCarousel';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import { Toast } from '../../components/Toast';

export default function ChooseLayoutPage() {
  const router = useRouter();
  const [selectedLayout, setSelectedLayout] = useState(null);
  const { selectedFeature, setSelectedLayout: setContextLayout } = usePhotoBoothContext();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setContextLayout(layout);
  };

  const handleDone = () => {
    if (selectedLayout) {
      setContextLayout(selectedLayout);
      if (selectedFeature === 'camera') {
        router.push('/capture');
      } else if (selectedFeature === 'gallery') {
        router.push('/upload');
      } else {
        router.push('/select-feature');
      }
    } else {
      setToastMessage('Please select a layout before proceeding');
      setShowToast(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundCircles />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Choose your layout</h1>

        <div className="bg-gray-100 p-4 sm:p-6 rounded-xl shadow-md w-full">
          <div className="mb-6">
            <LayoutCarousel onSelect={handleLayoutSelect} />
          </div>

          {!selectedLayout && (
            <p className="text-center text-gray-600 mb-4 text-sm sm:text-base">
              Please select a layout to continue
            </p>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleDone}
              className={`px-8 sm:px-12 py-2 sm:py-3 rounded-full font-medium text-white transition-colors text-sm sm:text-base ${
                selectedLayout ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!selectedLayout}
            >
              Done
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
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
