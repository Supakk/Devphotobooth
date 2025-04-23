import { useState, useRef } from 'react';

// ตัวอย่างเลย์เอาท์
const LAYOUTS = [
  [
    { id: 'layout1-1', name: 'Badtz-Maru 1-1', template: '3 Vertical Frames' },
    { id: 'layout1-2', name: 'Badtz-Maru 1-2', template: 'Split' },
    { id: 'layout1-3', name: 'Badtz-Maru 1-3', template: '2x2 Grid' },
    { id: 'layout1-4', name: 'Badtz-Maru 1-4', template: 'Polaroid' },
  ],
  [
    { id: 'layout2-1', name: 'Layout 2-1', template: 'Horizontal Banner' },
    { id: 'layout2-2', name: 'Layout 2-2', template: 'Centered Focus' },
    { id: 'layout2-3', name: 'Layout 2-3', template: 'Collage' },
    { id: 'layout2-4', name: 'Layout 2-4', template: 'Asymmetric' },
  ],
  [
    { id: 'layout3-1', name: 'Layout 2-1', template: 'Horizontal Banner' },
    { id: 'layout3-2', name: 'Layout 2-2', template: 'Centered Focus' },
    { id: 'layout3-3', name: 'Layout 2-3', template: 'Collage' },
    { id: 'layout3-4', name: 'Layout 2-4', template: 'Asymmetric' },
  ]
];

export default function LayoutCarousel({ onSelect }) {
  const [activeLayout, setActiveLayout] = useState(null);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLayoutClick = (layout) => {
    setActiveLayout(layout.id);
    if (onSelect) {
      onSelect(layout.id);
    }
  };

  const scrollCarousel = (direction) => {
    const newIndex = direction === 'next'
      ? Math.min(currentIndex + 1, LAYOUTS.length - 1)
      : Math.max(currentIndex - 1, 0);
    
    setCurrentIndex(newIndex);
    
    if (carouselRef.current) {
      const scrollAmount = newIndex * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="relative w-full">
        <button 
          onClick={() => scrollCarousel('prev')}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div 
          ref={carouselRef}
          className="flex overflow-x-hidden scroll-smooth py-4 px-8"
        >
          {LAYOUTS.map((layoutGroup, groupIndex) => (
            <div 
              key={`group-${groupIndex}`} 
              className="flex gap-4 flex-shrink-0 w-full"
              style={{ marginRight: groupIndex < LAYOUTS.length - 1 ? '4rem' : '0' }}
            >
              {layoutGroup.map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => handleLayoutClick(layout)}
                  className={`flex-1 h-64 bg-gray-300 rounded-lg cursor-pointer overflow-hidden border-2 ${
                    activeLayout === layout.id ? 'border-black' : 'border-transparent'
                  }`}
                >
                  {/* ตรงนี้คือที่จะแสดง placeholder หรือรูปแบบเลย์เอาท์ */}
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg font-medium">{layout.template}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => scrollCarousel('next')}
          disabled={currentIndex >= LAYOUTS.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* ตัวแสดงตำแหน่งหน้า (pagination) */}
      <div className="flex justify-center mt-4 space-x-2">
        {LAYOUTS.map((_, index) => (
          <div 
            key={`dot-${index}`}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? 'bg-black' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}