'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LayoutCarousel from '../../components/LayoutCarousel';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import { Toast } from '../../components/Toast';

export default function ChooseLayoutPage() {
  const router = useRouter();
  const { selectedFeature, setSelectedLayout } = usePhotoBoothContext();
  const [pickedLayout, setPickedLayout] = useState(null);
  const [toast, setToast] = useState(null);

  const handleLayoutSelect = (layout) => {
    setPickedLayout(layout);
  };

  const handleDone = () => {
    if (!pickedLayout) {
      setToast('Please select a layout first');
      return;
    }
    setSelectedLayout(pickedLayout);
    if (selectedFeature === 'gallery') {
      router.push('/upload');
    } else {
      router.push('/capture');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pb-8 overflow-hidden">
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-2xl animate-fadeInUp">
        {/* Back */}
        <button
          onClick={() => router.push('/select-feature')}
          className="flex items-center gap-1.5 text-violet-600 font-medium text-sm mb-6 hover:text-violet-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Step + Title */}
        <div className="mb-6 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-fuchsia-500 bg-fuchsia-50 border border-fuchsia-200 px-3 py-1 rounded-full mb-3">
            Step 2 of 3
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Choose your layout</h1>
          <p className="text-gray-400 text-sm mt-2">Pick a Sanrio character frame for your photos</p>
        </div>

        {/* Carousel card */}
        <div className="card p-5 md:p-7">
          <LayoutCarousel onSelect={handleLayoutSelect} />

          {/* Selected info */}
          {pickedLayout && (
            <div className="mt-4 flex items-center gap-3 bg-fuchsia-50 border border-fuchsia-200 rounded-xl px-4 py-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-fuchsia-700">{pickedLayout.name}</p>
                <p className="text-xs text-fuchsia-500">{pickedLayout.slots.length} photo slot{pickedLayout.slots.length > 1 ? 's' : ''}</p>
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleDone}
              disabled={!pickedLayout}
              className="btn-primary"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast} type="warning" onClose={() => setToast(null)} />
      )}
    </div>
  );
}
