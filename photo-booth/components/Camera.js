'use client';

import { useRef, useEffect, useState } from 'react';

export default function Camera({ onCapture, selectedFilter = { id: 'normal', cssFilter: 'none' } }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null); // ← fix: track interval for cleanup

  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (intervalRef.current) clearInterval(intervalRef.current); // ← fix
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      alert('Cannot access camera. Please allow camera permission and reload.');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const capturePhoto = () => {
    if (!cameraReady || isCapturing) return;

    setIsCapturing(true);
    setCountdown(3);

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimeout(() => {
            takeSnapshot();
            setIsCapturing(false);
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // ← fix: apply filter directly on canvas 2D context (works for ALL filter types)
    const cssFilter = selectedFilter?.cssFilter || 'none';
    if (cssFilter !== 'none') {
      ctx.filter = cssFilter;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none'; // reset

    const dataURL = canvas.toDataURL('image/jpeg', 0.92);
    if (onCapture) onCapture(dataURL);
  };

  const filterStyle = selectedFilter?.cssFilter && selectedFilter.cssFilter !== 'none'
    ? { filter: selectedFilter.cssFilter }
    : {};

  return (
    <div className="relative w-full">
      {/* Video preview with filter applied via inline style */}
      <div className="relative w-full rounded-xl overflow-hidden bg-black shadow-lg" style={filterStyle}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ aspectRatio: '4/3' }}
        />

        {/* Countdown overlay */}
        {isCapturing && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div
              className="text-7xl font-bold text-white drop-shadow-xl"
              style={{ textShadow: '0 2px 16px rgba(217,70,239,0.7)' }}
            >
              {countdown}
            </div>
          </div>
        )}

        {/* Camera not ready overlay */}
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center gap-3 text-white">
              <div className="w-10 h-10 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm opacity-70">Starting camera…</p>
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Shutter button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={capturePhoto}
          disabled={!cameraReady || isCapturing}
          className="relative"
          aria-label="Take photo"
        >
          {/* Outer ring */}
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all ${
            !cameraReady || isCapturing
              ? 'border-gray-300 opacity-50'
              : 'border-fuchsia-400 hover:border-fuchsia-500'
          }`}>
            {/* Inner fill */}
            <div className={`w-11 h-11 rounded-full transition-all ${
              !cameraReady || isCapturing
                ? 'bg-gray-300'
                : 'bg-gradient-to-br from-fuchsia-400 to-violet-500 hover:from-fuchsia-500 hover:to-violet-600'
            }`} />
          </div>
          {isCapturing && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-violet-500 font-medium whitespace-nowrap">
              {countdown > 0 ? `Taking in ${countdown}…` : 'Capturing…'}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
