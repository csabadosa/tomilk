import Image from 'next/image';
import Button2 from './Button2';

export default function Boxes() {
  return (
    <div className="h-1/3 w-full flex items-center justify-between bg-orange-200 px-4 hover:bg-orange-300 transition-all duration-300 ease-in-out">
      <div className="w-2/5 h-full rounded-lg overflow-hidden flex items-center justify-center p-5">
        <Image src="/assets/bus1_1.jpg" alt="bus" width={256} height={1} />
      </div>
      <div className="flex flex-col items-start justify-start w-3/5 p-4 rounded-lg shadow-lg">
        <h1 className="text-orange-900 text-xl font-extrabold">Valami Cím</h1>
        <span className="text-center text-black font-semibold">
          Helyi járatainkra nap mint nap számíthatnak a Csíkszereda – Balánbánya, valamint
          Csíkszereda – Ajnád útvonalon, míg különjárataink rugalmas és megbízható megoldást
          kínálnak ha máshová utazna.
        </span>
        <div className="flex items-center justify-center">
          <Button2 route="/">Hello There!</Button2>
        </div>
      </div>
    </div>
  );
}
