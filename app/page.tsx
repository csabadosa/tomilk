'use client';

import Boxes from '@/components/Boxes';
import Button2 from '@/components/Button2';
import NavBar from '@/components/NavBar';
import Title from '@/components/Title';
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
    <div className="w-full flex flex-col">
      <div className="w-full fixed top-0 left-0 z-50">
        <NavBar />
      </div>
      <div
        className="flex flex-col items-center justify-center h-screen overflow-hidden relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/background.jpg")' }}
      >
        <div className="absolute inset-0 bg-orange-100/30" />
        <h1 style={textStyle} className="text-orange-400 font-extrabold relative z-10">
          &quot;Utazás gondtalanul. <br />
        </h1>
        <h1 style={textStyle} className="text-black font-extrabold relative z-10">
          Dőljön hátra, mi elvisszük.&quot;
        </h1>
      </div>

      <div className="h-screen w-full bg-orange-400 items-center justify-between">
        <Boxes />
        <div className="h-1/3 w-full flex items-center justify-between bg-orange-200 p-4 hover:bg-orange-300 transition-all duration-300 ease-in-out">
          <div className="h-full flex flex-col items-start w-3/5 px-4 py-2 rounded-lg shadow-lg border-2 border-orange-200 gap-2">
            <Title title="Valami Cím" />
            <span className="text-black font-semibold">
              Helyi járatainkra nap mint nap számíthatnak a Csíkszereda – Balánbánya, valamint
              Csíkszereda – Ajnád útvonalon.
            </span>
            <div className="w-full flex items-end justify-end">
              <Button2 route="/">Hello Right!</Button2>
            </div>
          </div>
          <div className="w-2/5 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/assets/bus1.jpg" alt="bus" width={170} height={1} />
          </div>
        </div>
        <Boxes />
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
