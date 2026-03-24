'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function FinalPhotosPage() {
  const router = useRouter();
  const { mergedImage, selectedLayout, resetSession } = usePhotoBoothContext();
  const [displayImage, setDisplayImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Check context first, then sessionStorage fallback
    if (mergedImage) {
      setDisplayImage(mergedImage);
      setIsLoading(false);
      return;
    }
    try {
      const stored = sessionStorage.getItem('mergedImage');
      if (stored) {
        setDisplayImage(stored);
      } else {
        // Nothing found — send back to choose-layout
        router.replace('/choose-layout');
        return;
      }
    } catch {
      router.replace('/choose-layout');
      return;
    }
    setIsLoading(false);
  }, [mergedImage, router]);

  const handleDownload = () => {
    if (!displayImage) return;
    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.download = `photobooth-${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;
      link.href = displayImage;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 200);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleRetake = () => {
    router.push('/capture');
  };

  const handleStartOver = () => {
    resetSession();
    router.push('/');
  };

  // Compute display dimensions so image fits nicely on screen
  // The mergedImage was captured at scale:2, so it's 2x the layout pixel size.
  // We display it at a max of 400px wide / 70vh tall so it looks good.
  const layoutW = selectedLayout?.width ?? 190;
  const layoutH = selectedLayout?.height ?? 310;
  const MAX_W = 360;
  const MAX_H_VH = 0.65; // 65vh

  const scale = Math.min(MAX_W / layoutW, 1);
  const displayW = Math.round(layoutW * scale);
  const displayH = Math.round(layoutH * scale);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-md animate-fadeInUp">

        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎉</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gradient">Your Photo Strip!</h1>
          <p className="text-gray-400 text-sm mt-2">Looking amazing! Download or take another round.</p>
        </div>

        {/* Photo result */}
        <div className="card p-5 flex flex-col items-center">
          {displayImage ? (
            <div
              className="rounded-xl overflow-hidden shadow-lg border border-fuchsia-100"
              style={{
                width: displayW,
                height: displayH,
                maxHeight: `${MAX_H_VH * 100}vh`,
                position: 'relative',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImage}
                alt="Your photo strip"
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 text-sm">
              No image found
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleDownload}
              disabled={!displayImage || downloading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
            >
              {downloading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {downloading ? 'Saving…' : 'Download'}
            </button>

            <button onClick={handleRetake} className="btn-secondary flex-1 py-3">
              Retake Photos
            </button>
          </div>

          <button
            onClick={handleStartOver}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors w-full text-center py-1"
          >
            Start over from home
          </button>
        </div>
      </div>
    </div>
  );
}
