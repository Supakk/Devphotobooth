'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <BackgroundCircles />

      <div className="relative z-10 flex flex-col items-center gap-8 animate-fadeInUp">
        {/* Logo */}
        <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          style={{ boxShadow: '0 8px 32px rgba(217,70,239,0.3)' }}>
          <Image src="/image/Logo.png" fill alt="Photo Booth Logo" className="object-cover" priority />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gradient mb-3">
            Photo Booth
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-sm mx-auto leading-relaxed">
            Take fun photos, choose your favourite Sanrio layout, add filters and download your shots!
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/select-feature')}
          className="btn-primary text-lg px-10 py-4"
        >
          Get Started ✨
        </button>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          {['Webcam capture', 'Upload photos', 'Sanrio layouts', 'Filters', 'Free download'].map(f => (
            <span
              key={f}
              className="text-xs px-3 py-1 rounded-full bg-white border border-violet-100 text-violet-600 shadow-sm font-medium"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
