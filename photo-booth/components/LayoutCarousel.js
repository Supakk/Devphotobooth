import { useState, useRef } from 'react';
import Image from 'next/image';

// ตัวอย่างเลย์เอาท์ที่มีขนาดแตกต่างกัน
const LAYOUTS = [
  [
    { 
      id: 'layout1-1', 
      name: 'Badtz-Maru 1-1', 
      template: '3 Vertical Frames', 
      image: '/imagelayout/Badtz-Maru1-1.png', 
      width: 105.5, 
      height: 310,
      slots: [
        { top: 15.5 , left: 17, width: 71, height: 71 },  
        { top: 110.5, left: 17, width: 72, height: 72 }, 
        { top: 205.5, left: 17, width: 71, height: 71 }  
      ],
    },
    { 
      id: 'layout1-2', 
      name: 'Badtz-Maru 1-2', 
      template: '4 Vertical Frames', 
      image: '/imagelayout/Badtz-Maru1-2.png', 
      width: 190, 
      height: 310,
      slots: [
        { top: 8, left: 13, width: 72, height: 72 },
        { top: 124, left: 12, width: 159.5, height: 81 },
        { top: 225, left: 11.5, width: 72, height: 72 },
        { top: 225, left: 101, width: 72, height: 72 },
      ],
    },
    { 
      id: 'layout1-3', 
      name: 'Badtz-Maru 1-3', 
      template: '4 Vertical Frames', 
      image: '/imagelayout/Badtz-Maru1-3.png', 
      width: 520, 
      height: 310,
      slots: [
        { top: 40, left: 30, width: 220, height: 110 },
        { top: 40, left: 270, width: 220, height: 110 },
        { top: 170, left: 30, width: 220, height: 110 },
        { top: 170, left: 270, width: 220, height: 110 }
      ],
    },
    { 
      id: 'layout1-4', 
      name: 'Badtz-Maru 1-4', 
      template: '3 Vertical Frames', 
      image: '/imagelayout/Badtz-Maru1-4.png', 
      width: 105.5, 
      height: 290,
      slots: [
        { top: 13, left: 16, width: 70, height: 70 },   
        { top: 88.5, left: 16  , width: 70, height: 70 }, 
        { top: 162.5, left: 16, width: 70, height: 70 }  
      ],
    },
  ],
  [
    { 
      id: 'layout2-1', 
      name: 'Layout 2-1', 
      template: 'Horizontal Banner', 
      image: '', 
      width: 320, 
      height: 240,
      slots: [
        { top: 20, left: 20, width: 280, height: 200 },
      ],
    },
    { 
      id: 'layout2-2', 
      name: 'Layout 2-2', 
      template: 'Centered Focus', 
      image: '', 
      width: 280, 
      height: 280,
      slots: [
        { top: 40, left: 40, width: 200, height: 200 },
      ],
    },
    { 
      id: 'layout2-3', 
      name: 'Layout 2-3', 
      template: 'Collage', 
      image: '', 
      width: 260, 
      height: 300,
      slots: [
        { top: 20, left: 20, width: 105, height: 120 },
        { top: 20, left: 135, width: 105, height: 120 },
        { top: 150, left: 20, width: 220, height: 130 },
      ],
    },
    { 
      id: 'layout2-4', 
      name: 'Layout 2-4', 
      template: 'Asymmetric', 
      image: '', 
      width: 220, 
      height: 320,
      slots: [
        { top: 20, left: 20, width: 180, height: 130 },
        { top: 160, left: 20, width: 85, height: 140 },
        { top: 160, left: 115, width: 85, height: 140 },
      ],
    },
  ],
  [
    { 
      id: 'layout3-1', 
      name: 'Layout 3-1', 
      template: 'Horizontal Banner', 
      image: '', 
      width: 320, 
      height: 220,
      slots: [
        { top: 20, left: 20, width: 280, height: 180 },
      ],
    },
    { 
      id: 'layout3-2', 
      name: 'Layout 3-2', 
      template: 'Centered Focus', 
      image: '', 
      width: 260, 
      height: 260,
      slots: [
        { top: 30, left: 30, width: 200, height: 200 },
      ],
    },
    { 
      id: 'layout3-3', 
      name: 'Layout 3-3', 
      template: 'Collage', 
      image: '', 
      width: 280, 
      height: 320,
      slots: [
        { top: 20, left: 20, width: 240, height: 120 },
        { top: 150, left: 20, width: 115, height: 150 },
        { top: 150, left: 145, width: 115, height: 150 },
      ],
    },
    { 
      id: 'layout3-4', 
      name: 'Layout 3-4', 
      template: 'Asymmetric', 
      image: '', 
      width: 240, 
      height: 340,
      slots: [
        { top: 20, left: 20, width: 200, height: 130 },
        { top: 160, left: 20, width: 200, height: 160 },
      ],
    },
  ]
];

export default function LayoutCarousel({ onSelect }) {
  const [activeLayout, setActiveLayout] = useState(null);
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleLayoutClick = (layout) => {
    setActiveLayout(layout.id);
    if (onSelect) {
      onSelect(layout);
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
        {/* ปุ่มย้อนกลับ */}
        <button 
          onClick={() => scrollCarousel('prev')}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Carousel */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scroll-smooth space-x-4 py-4 px-4"
        >
          {LAYOUTS.map((layoutGroup, groupIndex) => (
            <div key={`group-${groupIndex}`} className="flex gap-4 flex-shrink-0">
              {layoutGroup.map((layout) => {
                const aspectRatio = layout.width / layout.height || 1; // กัน error ถ้า height เป็น 0
                return (
                  <div
                    key={layout.id}
                    onClick={() => handleLayoutClick(layout)}
                    className={`relative cursor-pointer overflow-hidden border-2 ${
                      activeLayout === layout.id ? 'border-black' : 'border-transparent'
                    } rounded-lg flex-shrink-0 bg-white`}
                    style={{
                      width: '125px', // หรือใช้ min/max ถ้าอยาก responsive
                      aspectRatio: `${aspectRatio}`,
                    }}
                  >
                    {layout.image ? (
                      <Image
                        src={layout.image}
                        alt={layout.name}
                        fill
                        className="object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-xs text-center px-2">
                        {layout.template}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* ปุ่มข้ามไปหน้า */}
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

      {/* pagination dots */}
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