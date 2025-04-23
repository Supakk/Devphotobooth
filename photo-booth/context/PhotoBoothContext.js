// context/PhotoBoothContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const PhotoBoothContext = createContext();

export function PhotoBoothProvider({ children }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  
  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const feature = localStorage.getItem('selectedFeature');
      const layout = localStorage.getItem('selectedLayout');
      const images = localStorage.getItem('capturedImages');
      
      if (feature) setSelectedFeature(feature);
      if (layout) setSelectedLayout(layout);
      if (images) setCapturedImages(JSON.parse(images));
    }
  }, []);
  
  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  const updateSelectedFeature = (feature) => {
    setSelectedFeature(feature);
    localStorage.setItem('selectedFeature', feature);
  };
  
  const updateSelectedLayout = (layout) => {
    setSelectedLayout(layout);
    localStorage.setItem('selectedLayout', layout);
  };
  
  const updateCapturedImages = (images) => {
    setCapturedImages(images);
    localStorage.setItem('capturedImages', JSON.stringify(images));
  };
  
  return (
    <PhotoBoothContext.Provider value={{
      selectedFeature, setSelectedFeature: updateSelectedFeature,
      selectedLayout, setSelectedLayout: updateSelectedLayout,
      capturedImages, setCapturedImages: updateCapturedImages
    }}>
      {children}
    </PhotoBoothContext.Provider>
  );
}

export const usePhotoBoothContext = () => useContext(PhotoBoothContext);