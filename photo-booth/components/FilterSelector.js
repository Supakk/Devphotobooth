'use client';

import { useState, useEffect } from 'react';
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

export default function FilterSelector({ onSelect, selectedFilter }) {
  const [selectedId, setSelectedId] = useState('normal');

  // Sync with parent component's selected filter
  useEffect(() => {
    if (selectedFilter && selectedFilter.id) {
      setSelectedId(selectedFilter.id);
    }
  }, [selectedFilter]);

  const handleFilterClick = (filter) => {
    setSelectedId(filter.id);
    if (onSelect) {
      onSelect(filter);
    }
  };

  return (
    <div className="flex flex-wrap justify-start gap-2 md:gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter)}
          className={`transition-all ${
            selectedId === filter.id
              ? 'ring-2 ring-black ring-offset-2'
              : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-1'
          }`}
        >
          <div
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gray-300 ${filter.class}`}
          >
            {/* Preview circle with filter applied */}
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}