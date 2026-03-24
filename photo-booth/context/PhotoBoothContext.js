'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const PhotoBoothContext = createContext();

export function PhotoBoothProvider({ children }) {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [mergedImage, setMergedImage] = useState(null);

  // On mount: restore only small data (feature + layout) from localStorage.
  // Never restore large base64 images from localStorage — quota would overflow.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const feature = localStorage.getItem('selectedFeature');
    if (feature) setSelectedFeature(feature);

    const layoutRaw = localStorage.getItem('selectedLayout');
    if (layoutRaw) {
      try { setSelectedLayout(JSON.parse(layoutRaw)); } catch { /* ignore */ }
    }

    // mergedImage lives only in sessionStorage (survives tab navigation, not refresh flood)
    try {
      const merged = sessionStorage.getItem('mergedImage');
      if (merged) setMergedImage(merged);
    } catch { /* ignore */ }
  }, []);

  // ── Updaters ──────────────────────────────────────────────────────────────

  const updateSelectedFeature = (feature) => {
    setSelectedFeature(feature);
    try { localStorage.setItem('selectedFeature', feature); } catch { /* ignore */ }
  };

  const updateSelectedLayout = (layout) => {
    setSelectedLayout(layout);
    try { localStorage.setItem('selectedLayout', JSON.stringify(layout)); } catch { /* ignore */ }
  };

  // capturedImages are kept in React state only — base64 data URLs are too
  // large for localStorage and are only needed within one session flow.
  const updateCapturedImages = (images) => {
    setCapturedImages(images);
  };

  const updateMergedImage = (image) => {
    setMergedImage(image);
    try {
      if (image) {
        sessionStorage.setItem('mergedImage', image);
      } else {
        sessionStorage.removeItem('mergedImage');
      }
    } catch (e) {
      // sessionStorage quota exceeded — keep in React state only
      console.warn('Could not persist mergedImage to sessionStorage:', e);
    }
  };

  const resetSession = () => {
    setCapturedImages([]);
    setMergedImage(null);
    try { sessionStorage.removeItem('mergedImage'); } catch { /* ignore */ }
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
      setMergedImage: updateMergedImage,
      resetSession,
    }}>
      {children}
    </PhotoBoothContext.Provider>
  );
}

export const usePhotoBoothContext = () => useContext(PhotoBoothContext);
