// components/Sidebar.tsx
import Link from 'next/link';
import Button from './Button';

export default function Sidebar() {
  return (
    <div className="w-50 bg-white text-black shadow-lg">
      <nav className="flex flex-col p-2 space-y-4">
        <Button route="/">Főoldal</Button>
        <Button route="/routes">Járataink</Button>
        <Button route="/custom-routes">Különjáratok</Button>
        <Button route="/vehicles">Járműveink</Button>
        <Button route="/about">Rólunk</Button>
        <Button route="/contact">Elérhetőség</Button>
      </nav>
    </div>
  );
}
