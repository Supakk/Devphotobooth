'use client';

// Filters use cssFilter (browser CSS filter string) — applied inline so they
// work everywhere: live camera preview, canvas capture, AND html2canvas merge.
export const FILTERS = [
  { id: 'normal',   name: 'Normal',    cssFilter: 'none' },
  { id: 'bw',       name: 'B&W',       cssFilter: 'grayscale(100%)' },
  { id: 'sepia',    name: 'Sepia',     cssFilter: 'sepia(100%)' },
  { id: 'vivid',    name: 'Vivid',     cssFilter: 'saturate(160%)' },
  { id: 'hicon',    name: 'Hi‑Con',    cssFilter: 'contrast(130%)' },
  { id: 'warm',     name: 'Warm',      cssFilter: 'brightness(1.05) sepia(0.3) saturate(1.2)' },
  { id: 'cool',     name: 'Cool',      cssFilter: 'brightness(1.05) hue-rotate(200deg) saturate(1.1)' },
  { id: 'vintage',  name: 'Vintage',   cssFilter: 'sepia(0.5) contrast(0.75) brightness(0.9)' },
  { id: 'fade',     name: 'Fade',      cssFilter: 'brightness(1.1) saturate(0.75) contrast(0.9)' },
];

// Sample gradient used as filter preview — visible through the filter effect
const SAMPLE_STYLE = {
  background: 'linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #38bdf8 100%)',
};

export default function FilterSelector({ onSelect, selectedFilter }) {
  const activeId = selectedFilter?.id ?? 'normal';

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(filter => (
        <button
          key={filter.id}
          onClick={() => onSelect?.(filter)}
          title={filter.name}
          className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all ${
            activeId === filter.id
              ? 'ring-2 ring-fuchsia-500 ring-offset-2 bg-fuchsia-50'
              : 'hover:bg-violet-50'
          }`}
        >
          {/* Gradient swatch with filter applied */}
          <div
            className="w-11 h-11 rounded-lg overflow-hidden border border-gray-200"
            style={{ filter: filter.cssFilter !== 'none' ? filter.cssFilter : undefined }}
          >
            <div className="w-full h-full" style={SAMPLE_STYLE} />
          </div>
          <span className={`text-[10px] font-medium leading-none ${
            activeId === filter.id ? 'text-fuchsia-600' : 'text-gray-500'
          }`}>
            {filter.name}
          </span>
        </button>
      ))}
    </div>
  );
}
