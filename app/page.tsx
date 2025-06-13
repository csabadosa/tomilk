'use client';

import NavBar from '@/components/NavBar';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const textStyle = {
  fontSize: '3rem',
};

export default function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col overflow-x-hidden">
      <div>
        <NavBar />
      </div>
      <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
        <h1 style={textStyle} className="text-orange-400 font-extrabold">
          &quot;Utazás gondtalanul. <br />
        </h1>
        <h1 style={textStyle} className="text-black font-extrabold">
          Dőljön hátra, mi elvisszük.&quot;
        </h1>
      </div>

      <div className="h-screen w-full bg-orange-400 flex items-center justify-between px-10 text-center text-black font-bold text-2xl">
        <div className="w-1/2">
          <span>
            Helyi járatainkra nap mint nap számíthatnak a Csíkszereda – Balánbánya, valamint
            Csíkszereda – Ajnád útvonalon, míg különjárataink rugalmas és megbízható megoldást
            kínálnak ha máshová utazna. Ha teherszállításra van szüksége, abban is segítünk.
            Autóbuszainkra számíthat legyen szó utazásról Hargita megyében, Romániában vagy akár
            külföldön. Árajánlatért keressen bizalommal!
          </span>
        </div>
        <div>
          <Image src="/assets/bus1.jpg" alt="bus" width={512} height={1} />
        </div>
      </div>
      <div
        className="fixed bottom-0 left-0 flex justify-center pl-2"
        style={{ transform: `translateX(${scrollPosition}px)` }}
      >
        <Image src="/assets/mercedes_sprinter.png" alt="bus" width={100} height={1} />
      </div>
    </div>
  );
}
