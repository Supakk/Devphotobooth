// context/PhotoBoothContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const PhotoBoothContext = createContext();

export function PhotoBoothProvider({ children }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [mergedImage, setMergedImage] = useState(null);
  
  // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const feature = localStorage.getItem('selectedFeature');
      const layout = localStorage.getItem('selectedLayout');
      const images = localStorage.getItem('capturedImages');
      const merged = localStorage.getItem('mergedImage');

      
      
      if (feature) setSelectedFeature(feature);
      if (layout) {
        try {
          setSelectedLayout(JSON.parse(layout));
        } catch (e) {
          // กรณีที่ layout ไม่ได้อยู่ในรูปแบบ JSON ให้ใช้ค่าเริ่มต้น
          console.error("Error parsing layout from localStorage:", e);
          setSelectedLayout(null);
        }
      }
      if (images) {
        try {
          setCapturedImages(JSON.parse(images));
        } catch (e) {
          console.error("Error parsing images from localStorage:", e);
          setCapturedImages([]);
        }
      }
      if (merged) {
        console.log("Loaded merged image from localStorage");
        setMergedImage(merged);
      } else {
        console.log("No merged image found in localStorage");
      }
    }
  }, []);
  
  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  const updateSelectedFeature = (feature) => {
    setSelectedFeature(feature);
    localStorage.setItem('selectedFeature', feature);
  };
  
  const updateSelectedLayout = (layout) => {
    setSelectedLayout(layout);
    localStorage.setItem('selectedLayout', JSON.stringify(layout));
  };
  
  const updateCapturedImages = (images) => {
    setCapturedImages(images);
    localStorage.setItem('capturedImages', JSON.stringify(images));
  };
  
  const updateMergedImage = (image) => {
    setMergedImage(image);
    if (image) {
      localStorage.setItem('mergedImage', image);
    } else {
      localStorage.removeItem('mergedImage');
    }
  };
  
  return (
    <PhotoBoothContext.Provider value={{
      selectedFeature, 
      setSelectedFeature: updateSelectedFeature,
      selectedLayout, 
      setSelectedLayout: updateSelectedLayout,
      capturedImages, 
      setCapturedImages: updateCapturedImages,
      mergedImage,
      setMergedImage: updateMergedImage
    }}>
      {children}
    </PhotoBoothContext.Provider>
  );
}

export const usePhotoBoothContext = () => useContext(PhotoBoothContext);