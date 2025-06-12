import Image from 'next/image';
import SideBar from './SideBar';
import Button from './Button';
import Button2 from './Button2';

const backgroundColor = {
  backgroundColor: '#fff',
};

export default function NavBar() {
  return (
    <div style={backgroundColor} className="w-full">
      <div style={backgroundColor} className="h-15 w-full flex items-center justify-between pr-4">
        <Image src="/assets/tomilk_logo_transparent.png" alt="tomilk" width={200} height={1} />
        <div className="flex items-center justify-between gap-4">
          <Button2 route="/reservation">Foglaljon Most</Button2>
          <Button route="/routes">Járataink</Button>
          <Button route="/vehicles">Járműveink</Button>
          <div className="relative group">
            <Image
              src="/assets/menu.png"
              alt="Menu"
              width={30}
              height={30}
              className="cursor-pointer"
            />
            <div className="absolute right-0 top-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
              <SideBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
