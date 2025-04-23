import { useState, useRef } from 'react';


// ตัวอย่างเลย์เอาท์
const LAYOUTS = [
  { id: 'layout1', name: 'Layout 1', template: 'Single' },
  { id: 'layout2', name: 'Layout 2', template: 'Split' },
  { id: 'layout3', name: 'Layout 3', template: '2x2 Grid' },
  { id: 'layout4', name: 'Layout 4', template: 'Polaroid' },
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
    
    // เลื่อน carousel ไปยังตำแหน่งที่ต้องการ
    if (carouselRef.current) {
      const scrollAmount = newIndex * 120; // 120px per item
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          onClick={() => scrollCarousel('prev')}
          disabled={currentIndex === 0}
          className="p-2 bg-gray-200 rounded-full mr-2 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LAYOUTS.map((layout) => (
            <div
              key={layout.id}
              onClick={() => handleLayoutClick(layout)}
              className={`flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg cursor-pointer flex items-center justify-center border-2 ${
                activeLayout === layout.id ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <span className="text-sm text-center">{layout.template}</span>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => scrollCarousel('next')}
          disabled={currentIndex >= LAYOUTS.length - 1}
          className="p-2 bg-gray-200 rounded-full ml-2 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="flex justify-center mt-4">
        {LAYOUTS.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}