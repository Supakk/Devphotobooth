import { useState, useRef } from 'react';
import Image from 'next/image';

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
        { top: 8, left: 12, width: 72, height: 72 },
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
      width: 190, 
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
      name: 'Pochacco 2-1', 
      template: '3 Vertical Frames', 
      image: '/imagelayout/Pochacco2-1.png', 
      width: 105.5, 
      height: 290,
      slots: [
        { top: 15.5 , left: 17, width: 71, height: 71 },  
        { top: 110.5, left: 17, width: 72, height: 72 }, 
        { top: 205.5, left: 17, width: 71, height: 71 }  
      ],
    },
    { 
      id: 'layout2-2', 
      name: 'Layout 2-2', 
      template: '4 Vertical Frames', 
      image: '/imagelayout/Pochacco2-2.png', 
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
      id: 'layout2-3', 
      name: 'Layout 2-3', 
      template: '4 Vertical Frames', 
      image: '/imagelayout/Pochacco2-3.png', 
      width: 190, 
      height: 310,
      slots: [
        { top: 40, left: 30, width: 220, height: 110 },
        { top: 40, left: 270, width: 220, height: 110 },
        { top: 170, left: 30, width: 220, height: 110 },
        { top: 170, left: 270, width: 220, height: 110 }
      ],
    },
    { 
      id: 'layout2-4', 
      name: 'Pochacco 2-4', 
      template: '3 Vertical Frames',  
      image: '/imagelayout/Pochacco2-4.png', 
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
      id: 'layout3-1', 
      name: 'Layout 3-1', 
      template: 'Horizontal Banner', 
      image: '', 
      width: 105.5, 
      height: 290,
      slots: [
        { top: 15.5 , left: 17, width: 71, height: 71 },  
        { top: 110.5, left: 17, width: 72, height: 72 }, 
        { top: 205.5, left: 17, width: 71, height: 71 }  
      ],
    },
    { 
      id: 'layout3-2', 
      name: 'Layout 3-2', 
      template: 'Centered Focus', 
      image: '', 
      width: 190, 
      height: 310,
      slots: [
        { top: 30, left: 30, width: 200, height: 200 },
      ],
    },
    { 
      id: 'layout3-3', 
      name: 'Layout 3-3', 
      template: 'Collage', 
      image: '', 
      width: 190, 
      height: 310,
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
      width: 105.5, 
      height: 290,
      slots: [
        { top: 13, left: 16, width: 70, height: 70 },   
        { top: 88.5, left: 16  , width: 70, height: 70 }, 
        { top: 162.5, left: 16, width: 70, height: 70 }  
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

  // ฟังก์ชันคำนวณขนาดตามสัดส่วน โดยกำหนดความสูงสูงสุด
  const calculateSize = (layout) => {
    const maxHeight = 270; // ความสูงสูงสุดที่ต้องการ
    const aspectRatio = layout.width / layout.height;
    
    let displayHeight = Math.min(maxHeight, layout.height * 2); // scale down ถ้าจำเป็น
    let displayWidth = displayHeight * aspectRatio;
    
    // ถ้าความกว้างเกินไป ให้ปรับตามความกว้างแทน
    const maxWidth = 400;
    if (displayWidth > maxWidth) {
      displayWidth = maxWidth;
      displayHeight = displayWidth / aspectRatio;
    }
    
    return {
      width: Math.round(displayWidth),
      height: Math.round(displayHeight)
    };
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
          className="flex overflow-x-auto scroll-smooth space-x-4 py-4 px-4 items-end"
        >
          {LAYOUTS.map((layoutGroup, groupIndex) => (
            <div key={`group-${groupIndex}`} className="flex gap-4 flex-shrink-0 items-end">
              {layoutGroup.map((layout) => {
                const size = calculateSize(layout);
                return (
                  <div
                    key={layout.id}
                    onClick={() => handleLayoutClick(layout)}
                    className={`relative cursor-pointer overflow-hidden border-2 ${
                      activeLayout === layout.id ? 'border-black' : 'border-transparent'
                    } rounded-lg flex-shrink-0 bg-white shadow-sm hover:shadow-md transition-shadow`}
                    style={{
                      width: `${size.width}px`,
                      height: `${size.height}px`,
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