'use client';

import BackgroundCircles from '@/components/BackgroundCircles';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePhotoBoothContext } from '../../context/PhotoBoothContext';

const FEATURES = [
  {
    id: 'camera',
    label: 'Take a Photo',
    desc: 'Use your webcam with live filters',
    // ← FIXED: was "Logocamera.png" (uppercase L) — fails on Linux
    icon: '/image/logocamera.png',
  },
  {
    id: 'gallery',
    label: 'Upload Photos',
    desc: 'Pick existing photos from your device',
    // ← FIXED: was "Logoupload.png" (uppercase L)
    icon: '/image/logoupload.png',
  },
];

export default function SelectFeaturePage() {
  const router = useRouter();
  const { setSelectedFeature } = usePhotoBoothContext();

  const handleSelect = (featureId) => {
    setSelectedFeature(featureId); // context + localStorage
    router.push('/choose-layout');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <BackgroundCircles />

      <div className="relative z-10 w-full max-w-lg animate-fadeInUp">
        {/* Back */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-1.5 text-violet-600 font-medium text-sm mb-6 hover:text-violet-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Step badge + title */}
        <div className="mb-8 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-fuchsia-500 bg-fuchsia-50 border border-fuchsia-200 px-3 py-1 rounded-full mb-3">
            Step 1 of 3
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            How do you want to add photos?
          </h1>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <button
              key={f.id}
              onClick={() => handleSelect(f.id)}
              className="card p-6 flex flex-col items-center gap-4 text-center group hover:border-fuchsia-300 hover:shadow-fuchsia-100 hover:shadow-xl transition-all duration-200 active:scale-98"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-fuchsia-50 to-violet-50 flex items-center justify-center relative shadow-sm group-hover:shadow-md transition-shadow">
                <Image src={f.icon} fill alt={f.label} className="object-contain p-2" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-base group-hover:text-fuchsia-600 transition-colors">{f.label}</p>
                <p className="text-gray-400 text-xs mt-1">{f.desc}</p>
              </div>
              <div className="btn-primary w-full text-sm py-2">Select</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
