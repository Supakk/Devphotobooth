'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';
import html2canvas from 'html2canvas';

export default function UploadPage() {
  const router = useRouter();
  const { selectedLayout, setCapturedImages, setMergedImage } = usePhotoBoothContext();

  const [previewUrls, setPreviewUrls] = useState([]);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [dims, setDims] = useState({ width: 190, height: 310 });

  // ── SINGLE ref for the off-screen merge target ───────────────────────────
  const mergeRef = useRef(null);

  useEffect(() => {
    if (!selectedLayout) { router.replace('/choose-layout'); return; }
    const count = selectedLayout.slots?.length ?? 1;
    setPreviewUrls(Array(count).fill(''));
    setFiles(Array(count).fill(null));
    setDims({
      width: typeof selectedLayout.width === 'string'
        ? parseInt(selectedLayout.width) : selectedLayout.width,
      height: typeof selectedLayout.height === 'string'
        ? parseInt(selectedLayout.height) : selectedLayout.height,
    });
  }, [selectedLayout, router]);

  const handleFile = (e, index) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target.result;
      setPreviewUrls(prev => { const a = [...prev]; a[index] = url; return a; });
      setFiles(prev => { const a = [...prev]; a[index] = file; return a; });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (index) => {
    setPreviewUrls(prev => { const a = [...prev]; a[index] = ''; return a; });
    setFiles(prev => { const a = [...prev]; a[index] = null; return a; });
  };

  const allFilled = files.every(f => f !== null);

  const handleContinue = async () => {
    if (!allFilled) return;
    if (!mergeRef.current) { setError('Preview not ready, try again.'); return; }
    setIsProcessing(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400)); // let DOM render images
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
      setCapturedImages(previewUrls);
      router.push('/final-photos');
    } catch (err) {
      console.error('Merge error:', err);
      setError('Failed to process images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Decorative preview scale
  const PREVIEW_MAX = 260;
  const previewScale = selectedLayout
    ? Math.min(PREVIEW_MAX / dims.width, PREVIEW_MAX / dims.height, 1)
    : 1;
  const previewW = Math.round(dims.width * previewScale);
  const previewH = Math.round(dims.height * previewScale);

  const totalSlots = selectedLayout?.slots?.length ?? 0;
  const filledCount = previewUrls.filter(u => u).length;

  if (!selectedLayout) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden pb-10">
      <BackgroundCircles />

      {/* ── OFF-SCREEN MERGE TARGET (single mergeRef) ──────────────────── */}
      <div
        ref={mergeRef}
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: `${dims.width}px`,
          height: `${dims.height}px`,
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        }}
      >
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
            {previewUrls[i] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrls[i]}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
        ))}
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6 animate-fadeInUp">

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
            Step 3 of 3 · Upload
          </span>
          <div className="w-16" />
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-6">Upload Your Photos</h1>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>
        )}
        {isProcessing && (
          <div className="mb-4 bg-violet-50 border border-violet-200 text-violet-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
            Processing your photo strip…
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Upload controls */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800">Select Photos</h2>
              <span className="text-xs text-gray-400">{filledCount}/{totalSlots} uploaded</span>
            </div>

            <div className="space-y-3">
              {selectedLayout.slots.map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-fuchsia-100 text-fuchsia-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>

                  {previewUrls[i] ? (
                    <div className="flex-1 flex items-center gap-3 bg-fuchsia-50 border border-fuchsia-200 rounded-xl px-3 py-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-fuchsia-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrls[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <span className="flex-1 text-xs text-fuchsia-700 font-medium truncate">{files[i]?.name}</span>
                      <button
                        onClick={() => handleRemove(i)}
                        disabled={isProcessing}
                        className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 border-2 border-dashed border-violet-200 rounded-xl py-3 px-4 flex items-center gap-2 cursor-pointer hover:border-fuchsia-400 hover:bg-fuchsia-50 transition-all">
                      <svg className="h-5 w-5 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm text-gray-400">Choose photo {i + 1}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFile(e, i)}
                        disabled={isProcessing}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${(filledCount / totalSlots) * 100}%` }} />
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!allFilled || isProcessing}
              className="btn-primary w-full mt-5 py-3"
            >
              {isProcessing ? 'Processing…' : 'Create Photo Strip →'}
            </button>
          </div>

          {/* Decorative layout preview (NO ref — just visual) */}
          <div className="card p-5 flex flex-col items-center">
            <h2 className="font-bold text-gray-800 mb-4 self-start">Preview</h2>
            <div
              className="relative bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm"
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
                    border: previewUrls[i] ? '1px solid #ddd6fe' : '1px dashed #c4b5fd',
                  }}
                >
                  {previewUrls[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrls[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                  alt="layout overlay"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 10 }}
                />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Layout: {selectedLayout.name} · {totalSlots} slot{totalSlots > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
