'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Camera from '../../components/Camera';
import FilterSelector, { FILTERS } from '../../components/FilterSelector';
import html2canvas from 'html2canvas';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function CapturePage() {
  const router = useRouter();
  const { selectedLayout, setCapturedImages: syncContextImages, setMergedImage } = usePhotoBoothContext();

  const [capturedImages, setCapturedImages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[0]);
  const [photoCount, setPhotoCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergeError, setMergeError] = useState(null);
  const [containerDims, setContainerDims] = useState({ width: 190, height: 310 });

  // ── SINGLE ref for the hidden off-screen merge target ────────────────────
  // There is only ONE element using this ref — the off-screen div below.
  // The visible preview is purely decorative and uses NO ref.
  const mergeRef = useRef(null);

  // Redirect if no layout selected
  useEffect(() => {
    if (!selectedLayout) { router.replace('/choose-layout'); return; }
    const slots = selectedLayout.slots ?? [];
    setPhotoCount(slots.length || 1);
    setContainerDims({
      width: typeof selectedLayout.width === 'string'
        ? parseInt(selectedLayout.width) : selectedLayout.width,
      height: typeof selectedLayout.height === 'string'
        ? parseInt(selectedLayout.height) : selectedLayout.height,
    });
  }, [selectedLayout, router]);

  // ── Auto-merge once all photos are captured ──────────────────────────────
  // Uses useEffect so we wait for React to commit the new capturedImages to
  // the DOM (inside the hidden merge div) before running html2canvas.
  useEffect(() => {
    if (capturedImages.length > 0 && capturedImages.length >= photoCount && !isProcessing) {
      const timer = setTimeout(() => {
        doMerge();
      }, 600); // Let React paint the new image into the hidden div
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImages.length, photoCount]);

  const doMerge = async () => {
    if (!mergeRef.current) { setMergeError('Merge target not found'); return; }
    setIsProcessing(true);
    setMergeError(null);
    try {
      const canvas = await html2canvas(mergeRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        allowTaint: true,
        imageTimeout: 15000,
      });
      const dataURL = canvas.toDataURL('image/jpeg', 0.92);
      setMergedImage(dataURL);
      syncContextImages(capturedImages);
      router.push('/final-photos');
    } catch (err) {
      console.error('Merge error:', err);
      setMergeError('Failed to process photos. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = (dataURL) => {
    setCapturedImages(prev => [...prev, dataURL]);
  };

  const handleRetake = () => {
    setCapturedImages(prev => prev.slice(0, -1));
  };

  // ── Visible preview scale (decorative only, no ref needed) ───────────────
  const PREVIEW_MAX = 220;
  const previewScale = Math.min(
    PREVIEW_MAX / containerDims.width,
    PREVIEW_MAX / containerDims.height,
    1
  );
  const previewW = Math.round(containerDims.width * previewScale);
  const previewH = Math.round(containerDims.height * previewScale);

  if (!selectedLayout) return null;

  return (
    <div className="relative min-h-screen overflow-hidden pb-10">
      <BackgroundCircles />

      {/* ── OFF-SCREEN MERGE TARGET (single previewRef) ─────────────────── */}
      {/* Fixed position far off-screen so it's in the DOM but invisible.
          html2canvas captures DOM elements regardless of visual position. */}
      <div
        ref={mergeRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: `${containerDims.width}px`,
          height: `${containerDims.height}px`,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Photo slots at full (1:1) scale */}
        {selectedLayout.slots?.map((slot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: `${slot.top}px`,
              left: `${slot.left}px`,
              width: `${slot.width}px`,
              height: `${slot.height}px`,
              overflow: 'hidden',
            }}
          >
            {capturedImages[i] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={capturedImages[i]}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
        ))}
        {/* Layout overlay image */}
        {selectedLayout.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selectedLayout.image}
            alt=""
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'contain', zIndex: 10,
            }}
          />
        )}
      </div>

      {/* ── VISIBLE UI ──────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-6">

        {/* Back + Step */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/choose-layout')}
            className="flex items-center gap-1.5 text-violet-600 font-medium text-sm hover:text-violet-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-fuchsia-500 bg-fuchsia-50 border border-fuchsia-200 px-3 py-1 rounded-full">
            Step 3 of 3 · Camera
          </span>
          <div className="w-16" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-6">
          Capture Your Photos
        </h1>

        {/* Error */}
        {mergeError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {mergeError}
          </div>
        )}

        {/* Processing banner */}
        {isProcessing && (
          <div className="mb-4 bg-violet-50 border border-violet-200 text-violet-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
            Processing your photo strip… please wait
          </div>
        )}

        {/* ── Desktop layout (md+) ── */}
        <div className="hidden md:grid md:grid-cols-12 gap-5">

          {/* Filters */}
          <div className="md:col-span-3">
            <div className="card p-4 h-full">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Filters</h3>
              <FilterSelector onSelect={setSelectedFilter} selectedFilter={selectedFilter} />

              <div className="mt-6 space-y-2">
                {capturedImages.length > 0 && (
                  <button
                    onClick={handleRetake}
                    disabled={isProcessing}
                    className="btn-secondary w-full text-sm py-2"
                  >
                    ↩ Retake Last
                  </button>
                )}
                {capturedImages.length >= photoCount && (
                  <button
                    onClick={doMerge}
                    disabled={isProcessing}
                    className="btn-primary w-full text-sm py-2"
                  >
                    {isProcessing ? 'Processing…' : 'Merge & Continue →'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Camera feed */}
          <div className="md:col-span-6">
            <div className="card p-4">
              <Camera onCapture={handleCapture} selectedFilter={selectedFilter} />
            </div>
          </div>

          {/* Decorative preview (NO ref — just for visual feedback) */}
          <div className="md:col-span-3">
            <div className="card p-4 flex flex-col items-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Preview</p>
              <div
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                style={{ width: previewW, height: previewH }}
              >
                {selectedLayout.slots?.map((slot, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: slot.top * previewScale,
                      left: slot.left * previewScale,
                      width: slot.width * previewScale,
                      height: slot.height * previewScale,
                      overflow: 'hidden',
                      border: capturedImages[i] ? '1px solid #ddd6fe' : '1px dashed #c4b5fd',
                    }}
                  >
                    {capturedImages[i] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={capturedImages[i]}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: selectedFilter?.cssFilter !== 'none' ? selectedFilter?.cssFilter : undefined }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-violet-50 text-violet-300 text-xs font-bold">
                        {i + 1}
                      </div>
                    )}
                  </div>
                ))}
                {selectedLayout.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedLayout.image}
                    alt="layout"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 10 }}
                  />
                )}
              </div>

              {/* Progress */}
              <div className="mt-4 w-full">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${(capturedImages.length / photoCount) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-center text-gray-500 mt-1.5">
                  {capturedImages.length} / {photoCount} photo{photoCount > 1 ? 's' : ''} taken
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="md:hidden space-y-4">
          {/* Camera */}
          <div className="card p-4">
            <Camera onCapture={handleCapture} selectedFilter={selectedFilter} />
          </div>

          {/* Progress */}
          <div className="card p-4">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(capturedImages.length / photoCount) * 100}%` }}
              />
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
              {capturedImages.length} / {photoCount} photo{photoCount > 1 ? 's' : ''}
            </p>

            {/* Thumbnails */}
            {capturedImages.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {capturedImages.map((img, i) => (
                  <div key={i} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-violet-200 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Photo ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: selectedFilter?.cssFilter !== 'none' ? selectedFilter?.cssFilter : undefined }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              {capturedImages.length > 0 && (
                <button onClick={handleRetake} disabled={isProcessing} className="btn-secondary flex-1 text-sm py-2">
                  ↩ Retake
                </button>
              )}
              {capturedImages.length >= photoCount && (
                <button onClick={doMerge} disabled={isProcessing} className="btn-primary flex-1 text-sm py-2">
                  {isProcessing ? 'Processing…' : 'Done →'}
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Filters</h3>
            <FilterSelector onSelect={setSelectedFilter} selectedFilter={selectedFilter} />
          </div>
        </div>
      </div>
    </div>
  );
}
