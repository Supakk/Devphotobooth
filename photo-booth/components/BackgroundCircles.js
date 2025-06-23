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

      <style jsx>{`
        .area {
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .circles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .circles li {
          position: absolute;
          display: block;
          list-style: none;
          border-radius: 50%;
          animation: animate 25s linear infinite;
          bottom: -150px;
        }

        .circles li:nth-child(1) {
          left: 25%;
          width: 80px;
          height: 80px;
          animation-delay: 0s;
        }

        .circles li:nth-child(2) {
          left: 10%;
          width: 20px;
          height: 20px;
          animation-delay: 2s;
          animation-duration: 12s;
        }

        .circles li:nth-child(3) {
          left: 70%;
          width: 20px;
          height: 20px;
          animation-delay: 4s;
        }

        .circles li:nth-child(4) {
          left: 40%;
          width: 60px;
          height: 60px;
          animation-delay: 0s;
          animation-duration: 18s;
        }

        .circles li:nth-child(5) {
          left: 65%;
          width: 20px;
          height: 20px;
          animation-delay: 0s;
        }

        .circles li:nth-child(6) {
          left: 75%;
          width: 110px;
          height: 110px;
          animation-delay: 3s;
        }

        .circles li:nth-child(7) {
          left: 57%;
          width: 120px;
          height: 120px;
          animation-delay: 0s;
        }

        .circles li:nth-child(8) {
          left: 50%;
          width: 25px;
          height: 25px;
          animation-delay: 15s;
          animation-duration: 45s;
        }

        .circles li:nth-child(9) {
          left: 20%;
          width: 15px;
          height: 15px;
          animation-delay: 2s;
          animation-duration: 35s;
        }

        .circles li:nth-child(10) {
          left: 85%;
          width: 150px;
          height: 150px;
          animation-delay: 0s;
          animation-duration: 11s;
        }

        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }

        /* Mobile Responsive - เล็กลง */
        @media (max-width: 480px) {
          .circles li:nth-child(1) {
            width: 50px;
            height: 50px;
          }
          .circles li:nth-child(2) {
            width: 15px;
            height: 15px;
          }
          .circles li:nth-child(3) {
            width: 15px;
            height: 15px;
          }
          .circles li:nth-child(4) {
            width: 40px;
            height: 40px;
          }
          .circles li:nth-child(5) {
            width: 15px;
            height: 15px;
          }
          .circles li:nth-child(6) {
            width: 70px;
            height: 70px;
          }
          .circles li:nth-child(7) {
            width: 90px;
            height: 90px;
          }
          .circles li:nth-child(8) {
            width: 18px;
            height: 18px;
          }
          .circles li:nth-child(9) {
            width: 12px;
            height: 12px;
          }
          .circles li:nth-child(10) {
            width: 90px;
            height: 90px;
          }
        }

        /* Small Mobile - 320px */
        @media (max-width: 320px) {
          .circles li:nth-child(1) {
            width: 40px;
            height: 40px;
          }
          .circles li:nth-child(2) {
            width: 12px;
            height: 12px;
          }
          .circles li:nth-child(3) {
            width: 12px;
            height: 12px;
          }
          .circles li:nth-child(4) {
            width: 30px;
            height: 30px;
          }
          .circles li:nth-child(5) {
            width: 12px;
            height: 12px;
          }
          .circles li:nth-child(6) {
            width: 50px;
            height: 50px;
          }
          .circles li:nth-child(7) {
            width: 70px;
            height: 70px;
          }
          .circles li:nth-child(8) {
            width: 15px;
            height: 15px;
          }
          .circles li:nth-child(9) {
            width: 10px;
            height: 10px;
          }
          .circles li:nth-child(10) {
            width: 70px;
            height: 70px;
          }
        }

        /* Tablet */
        @media (min-width: 768px) and (max-width: 1024px) {
          .circles li:nth-child(1) {
            width: 100px;
            height: 100px;
          }
          .circles li:nth-child(2) {
            width: 25px;
            height: 25px;
          }
          .circles li:nth-child(3) {
            width: 25px;
            height: 25px;
          }
          .circles li:nth-child(4) {
            width: 75px;
            height: 75px;
          }
          .circles li:nth-child(5) {
            width: 25px;
            height: 25px;
          }
          .circles li:nth-child(6) {
            width: 130px;
            height: 130px;
          }
          .circles li:nth-child(7) {
            width: 170px;
            height: 170px;
          }
          .circles li:nth-child(8) {
            width: 30px;
            height: 30px;
          }
          .circles li:nth-child(9) {
            width: 18px;
            height: 18px;
          }
          .circles li:nth-child(10) {
            width: 170px;
            height: 170px;
          }
        }

        /* Desktop Large */
        @media (min-width: 1280px) {
          .circles li:nth-child(1) {
            width: 120px;
            height: 120px;
          }
          .circles li:nth-child(2) {
            width: 30px;
            height: 30px;
          }
          .circles li:nth-child(3) {
            width: 30px;
            height: 30px;
          }
          .circles li:nth-child(4) {
            width: 90px;
            height: 90px;
          }
          .circles li:nth-child(5) {
            width: 30px;
            height: 30px;
          }
          .circles li:nth-child(6) {
            width: 160px;
            height: 160px;
          }
          .circles li:nth-child(7) {
            width: 200px;
            height: 200px;
          }
          .circles li:nth-child(8) {
            width: 35px;
            height: 35px;
          }
          .circles li:nth-child(9) {
            width: 22px;
            height: 22px;
          }
          .circles li:nth-child(10) {
            width: 200px;
            height: 200px;
          }
        }

        /* Ultra Wide */
        @media (min-width: 1536px) {
          .circles li:nth-child(1) {
            width: 140px;
            height: 140px;
          }
          .circles li:nth-child(6) {
            width: 180px;
            height: 180px;
          }
          .circles li:nth-child(7) {
            width: 220px;
            height: 220px;
          }
          .circles li:nth-child(10) {
            width: 220px;
            height: 220px;
          }
        }
      `}</style>
    </div>
  );
}