import { useState, useRef, useEffect, useCallback } from 'react';

export default function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  
  // แยก onCapture ออกมาเป็น useCallback เพื่อไม่ให้สร้างใหม่ทุกครั้งที่ render
  const handleCapture = useCallback((imageData) => {
    if (onCapture) {
      // ต้องหน่วงเวลาเล็กน้อยเพื่อให้ React จัดการการ render ให้เสร็จก่อน
      setTimeout(() => {
        onCapture(imageData);
      }, 0);
    }
  }, [onCapture]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('ไม่สามารถเข้าถึงกล้องได้ กรุณาตรวจสอบการอนุญาตใช้งานกล้อง');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // ตั้งค่าขนาด canvas ให้เท่ากับวิดีโอ
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // วาดภาพจากวิดีโอลงใน canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // แปลงข้อมูลจาก canvas เป็น base64
      const imageData = canvas.toDataURL('image/png');
      
      // ส่งข้อมูลรูปภาพไปยังคอมโพเนนท์แม่
      handleCapture(imageData);
    }
  }, [handleCapture]);

  const startCountdown = () => {
    setIsRecording(true);
    setCountdown(3);
    
    // เริ่มนับถอยหลัง
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // ย้ายการเรียก capturePhoto และ setIsRecording ไปอยู่ใน setTimeout
          setTimeout(() => {
            capturePhoto();
            setIsRecording(false);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="relative">
      {cameraError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{cameraError}</p>
        </div>
      ) : (
        <>
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[4/4] w-full max-w-md mx-auto">
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="text-white text-6xl font-bold">{countdown}</div>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            <button
              onClick={startCountdown}
              disabled={isRecording}
              className="bg-black text-white p-4 rounded-full hover:bg-gray-800 transition disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          {/* Canvas ที่ซ่อนไว้สำหรับประมวลผล */}
          <canvas ref={canvasRef} className="hidden" />
        </>
      )}
    </div>  
  );
}