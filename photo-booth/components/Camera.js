'use client';

import { useRef, useEffect, useState } from 'react';

export default function Camera({ onCapture, selectedFilter = { id: 'normal', name: 'Normal', class: '' } }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraReady(true);
      }
    } catch (err) {
      console.error('Error accessing camera: ', err);
      alert('Cannot access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!cameraReady || isCapturing) return;

    setIsCapturing(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
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
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Apply similar filter effects as in CSS if needed
    // This would need custom implementations for each filter
    if (selectedFilter.id !== 'normal') {
      applyCanvasFilter(context, canvas, selectedFilter.id);
    }

    // Convert to data URL
    const imageDataURL = canvas.toDataURL('image/png');
    
    // Pass to parent
    if (onCapture) {
      onCapture(imageDataURL);
    }
  };

  // Function to apply filter effects on canvas
  // Note: This is a simplified version - for production you'd need more sophisticated filter implementations
  const applyCanvasFilter = (context, canvas, filterId) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    switch (filterId) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;     // R
          data[i + 1] = avg; // G
          data[i + 2] = avg; // B
        }
        break;
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      // Add more filter cases as needed
    }
    
    context.putImageData(imageData, 0, 0);
  };

  return (
    <div className="relative w-full">
      {/* Camera display with filter applied */}
      <div className={`relative w-full overflow-hidden rounded-lg ${selectedFilter.class}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {isCapturing && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white bg-black bg-opacity-50 rounded-full w-24 h-24 flex items-center justify-center">
              {countdown}
            </div>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 flex justify-center">
        <button
          onClick={capturePhoto}
          disabled={!cameraReady || isCapturing}
          className={`px-6 py-2 rounded-full ${
            !cameraReady || isCapturing
              ? 'bg-gray-400'
              : 'bg-black hover:bg-gray-800'
          } text-white font-medium transition-colors`}
        >
          {isCapturing ? 'Capturing...' : 'Take Photo'}
        </button>
      </div>
    </div>
  );
}