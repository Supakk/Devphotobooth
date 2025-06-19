// components/BackgroundCircles.js
'use client';
import Image from 'next/image';

const bgImages = [
  { src: "/image/kitty.png", alt: "Hello Kitty" },
  { src: "/image/hangyodon.jpg", alt: "Hangyodon" },
  { src: "/image/Tuxedo.png", alt: "Tuxedo Sam" },
  { src: "/image/mymelody.png", alt: "My Melody" },
  { src: "/image/littletwinstar.png", alt: "Little Twin Stars" },
  { src: "/image/keroppi.png", alt: "Keroppi" },
  { src: "/image/chococat.png", alt: "Chococat" },
  { src: "/image/kuromi.png", alt: "Kuromi" },
  { src: "/image/Badtz-Maru.png", alt: "Badtz-Maru" },
  { src: "/image/Pochacco.png", alt: "Pochacco" },
];

export default function BackgroundCircles() {
  return (
    <div className="area absolute inset-0 z-0 bg-white">
      <ul className="circles">
        {bgImages.map((item, index) => (
          <li key={index} className="relative">
            <Image 
              src={item.src} 
              fill 
              alt={item.alt} 
              sizes="(max-width: 320px) 80px, (max-width: 480px) 100px, (max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, (max-width: 1280px) 180px, (max-width: 1536px) 200px, 220px"
              className="object-contain" 
              priority={index < 2} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
