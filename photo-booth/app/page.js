'use client';

import BackgroundCircles from "@/components/BackgroundCircles";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/select-feature");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Animation */}
      <BackgroundCircles />
      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center w-full px-4 py-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-black text-center">Photo Booth</h1>
      </div>
        <h2 className="text-xs md:text-sm font-semibold text-black mb-4 md:mb-8 lg:mb-14 text-center">
          Let's have fun taking photos! Choose props, add filters, and share your awesome moments! ✨
        </h2>

        <div className="bg-gray-200 p-6 md:p-8 rounded-lg shadow-md text-center w-full max-w-xs md:max-w-sm lg:max-w-md flex flex-col items-center justify-center gap-4 md:gap-6">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-lg flex items-center justify-center border-2 border-gray-300 relative overflow-hidden">
            <Image
              src="/image/Logo.png" 
              fill
              alt="Photo Booth Icon"
              className="object-cover"
            />
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-gray-800 transition font-medium text-sm md:text-base"
          >
            Get Started
          </button> 
        </div>
      </div>
  );
}