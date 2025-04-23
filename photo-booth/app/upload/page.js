'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const { selectedLayout, setCapturedImages } = usePhotoBoothContext();

  // Check if layout is selected, if not redirect back
  useEffect(() => {
    if (!selectedLayout) {
      router.push('/choose-layout');
    }
  }, [selectedLayout, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Here you would handle the upload logic
      // For now, let's just move to the final page
      router.push('/final-photos');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation - Same as other pages */}
      <div className="area absolute inset-0 z-0 bg-white">
        {/* Same background content */}
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-black">Upload Your Photo</h1>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md w-full">
          {previewUrl ? (
            <div className="mb-6">
              <div className="w-full h-64 relative mb-4">
                <Image 
                  src={previewUrl}
                  fill
                  alt="Preview"
                  className="object-contain"
                />
              </div>
              <button 
                onClick={() => {setSelectedFile(null); setPreviewUrl('');}}
                className="px-4 py-2 bg-gray-200 rounded-md mr-2"
              >
                Change Photo
              </button>
              <button
                onClick={handleUpload}
                className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <label className="w-64 h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click to upload a photo</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}