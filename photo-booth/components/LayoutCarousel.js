'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { TEMPLATE_GROUPS } from '@/config/templates';

// Flatten groups → 2D array for carousel (each group = one carousel page)
const LAYOUTS = TEMPLATE_GROUPS.map(g => g.templates);

// Scale layout to a fixed display height for the carousel
function calcDisplaySize(layout, maxHeight = 240) {
  const ratio = layout.width / layout.height;
  const h = Math.min(maxHeight, layout.height * 2);
  const w = h * ratio;
  if (w > 180) {
    return { w: 180, h: 180 / ratio };
  }
  return { w: Math.round(w), h: Math.round(h) };
}

export default function LayoutCarousel({ onSelect }) {
  const [activeId, setActiveId] = useState(null);
  const [groupIndex, setGroupIndex] = useState(0);
  const containerRef = useRef(null);

  const group = LAYOUTS[groupIndex];

  const handleSelect = (layout) => {
    setActiveId(layout.id);
    onSelect?.(layout);
  };

  const prevGroup = () => setGroupIndex(i => Math.max(0, i - 1));
  const nextGroup = () => setGroupIndex(i => Math.min(LAYOUTS.length - 1, i + 1));

  return (
    <div className="w-full">
      {/* Character group navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevGroup}
          disabled={groupIndex === 0}
          className="w-9 h-9 rounded-full bg-white border border-violet-200 flex items-center justify-center text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-50 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {LAYOUTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setGroupIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === groupIndex
                  ? 'bg-fuchsia-500 scale-125'
                  : 'bg-violet-200 hover:bg-violet-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextGroup}
          disabled={groupIndex >= LAYOUTS.length - 1}
          className="w-9 h-9 rounded-full bg-white border border-violet-200 flex items-center justify-center text-violet-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-50 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Layout thumbnails for current group */}
      <div
        ref={containerRef}
        className="flex gap-4 items-end justify-center flex-wrap py-2 px-2 min-h-[260px]"
      >
        {group.map(layout => {
          const { w, h } = calcDisplaySize(layout);
          const isActive = activeId === layout.id;
          return (
            <button
              key={layout.id}
              onClick={() => handleSelect(layout)}
              className={`relative rounded-xl overflow-hidden bg-white flex-shrink-0 transition-all shadow-md ${
                isActive
                  ? 'ring-2 ring-fuchsia-500 ring-offset-2 shadow-fuchsia-200 shadow-lg scale-105'
                  : 'hover:shadow-lg hover:scale-102 ring-1 ring-gray-100'
              }`}
              style={{ width: w, height: h }}
            >
              <Image
                src={layout.image}
                alt={layout.name}
                fill
                className="object-contain"
              />
              {/* Active check badge */}
              {isActive && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-fuchsia-500 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {/* Layout name */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent py-1.5 px-2">
                <p className="text-white text-[9px] font-semibold truncate text-center">{layout.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Slot count hints */}
      <div className="mt-3 flex justify-center gap-3 flex-wrap">
        {group.map(layout => (
          <div
            key={layout.id}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              activeId === layout.id
                ? 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300'
                : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}
          >
            {layout.name} · {layout.slots.length} photo{layout.slots.length > 1 ? 's' : ''}
          </div>
        ))}
      </div>
    </div>
  );
}
