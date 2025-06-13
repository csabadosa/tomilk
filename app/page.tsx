'use client';

import Button from '@/components/Button';
import Button2 from '@/components/Button2';
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
    <div className="w-full flex flex-col">
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

      <div className="h-screen w-full bg-orange-400 items-center justify-between">
        <div className="h-1/3 w-full flex items-center justify-between bg-orange-200 p-4 hover:bg-orange-300 transition-all duration-300 ease-in-out">
          <div className="w-2/5 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/assets/bus1.jpg" alt="bus" width={170} height={1} />
          </div>
          <div className="flex flex-col items-center justify-center w-3/5 p-4 rounded-lg shadow-lg border-2 border-orange-200">
            <span className="text-center text-black font-bold">
              Helyi járatainkra nap mint nap számíthatnak a Csíkszereda – Balánbánya, valamint
              Csíkszereda – Ajnád útvonalon, míg különjárataink rugalmas és megbízható megoldást
              kínálnak ha máshová utazna.
            </span>
            <Button2 route="/">Hello There!</Button2>
          </div>
        </div>
        <div className="h-1/3 w-full flex items-center justify-between bg-orange-200 p-4 hover:bg-orange-300 transition-all duration-300 ease-in-out">
          <div className="h-full flex flex-col items-start w-3/5 px-4 py-2 rounded-lg shadow-lg border-2 border-orange-200 gap-2">
            <h1 className="text-orange-900 text-xl font-extrabold border-b">Valami Cím</h1>
            <span className="text-black font-bold">
              Helyi járatainkra nap mint nap számíthatnak a Csíkszereda – Balánbánya, valamint
              Csíkszereda – Ajnád útvonalon.
            </span>
            <Button route="/">Hello There!</Button>
          </div>
          <div className="w-2/5 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/assets/bus1.jpg" alt="bus" width={170} height={1} />
          </div>
        </div>
        <div className="h-1/3 w-full flex items-center justify-between bg-orange-200 p-4 hover:bg-orange-300 transition-all duration-300 ease-in-out">
          <div className="w-2/5 rounded-lg overflow-hidden flex items-center justify-center">
            <Image src="/assets/bus1.jpg" alt="bus" width={170} height={1} />
          </div>
          <div className="flex flex-col items-center justify-center w-3/5 p-4 rounded-lg shadow-lg border-2 border-orange-200">
            <span className="text-center text-black font-bold">
              Helyi járatainkra nap mint nap számíthatnak a Csíkszereda – Balánbánya, valamint
              Csíkszereda – Ajnád útvonalon, míg különjárataink rugalmas és megbízható megoldást
              kínálnak ha máshová utazna.
            </span>
            <Button2 route="/">Hello There!</Button2>
          </div>
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
