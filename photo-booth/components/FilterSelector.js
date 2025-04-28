'use client';

import { useState } from 'react';
import Image from 'next/image';

// ตัวอย่างฟิลเตอร์ - คุณสามารถเพิ่มเติมได้ตามต้องการ
const filters = [
  { id: 'normal', name: 'Normal', class: '' },
  { id: 'grayscale', name: 'Grayscale', class: 'filter grayscale' },
  { id: 'sepia', name: 'Sepia', class: 'filter sepia' },
  { id: 'saturate', name: 'Vivid', class: 'filter saturate-150' },
  { id: 'contrast', name: 'High Contrast', class: 'filter contrast-125' },
  { id: 'warmth', name: 'Warm', class: 'filter brightness-105 sepia-25' },
  { id: 'cool', name: 'Cool', class: 'filter brightness-105 hue-rotate-15' },
  { id: 'vintage', name: 'Vintage', class: 'filter sepia-50 contrast-75 brightness-90' },
];

export default function FilterSelector({ onSelect }) {
  const [selectedId, setSelectedId] = useState('normal');
  
  const handleFilterClick = (filter) => {
    setSelectedId(filter.id);
    if (onSelect) {
      onSelect(filter);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter)}
          className={`p-2 rounded-lg transition-all ${
            selectedId === filter.id
              ? 'ring-2 ring-black bg-gray-200 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded bg-gray-300 flex items-center justify-center mb-1 ${filter.class}`}
            >
              {/* สามารถใส่รูปตัวอย่างให้ฟิลเตอร์ได้ */}
              <span className="text-2xl">📷</span>
            </div>
            <span className="text-xs font-medium text-gray-700">
              {filter.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}