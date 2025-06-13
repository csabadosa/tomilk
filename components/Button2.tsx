import Link from 'next/link';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  route: string;
};

const Button2 = ({ children, route }: ButtonProps) => {
  return (
    <Link
      href={route}
      className="bg-orange-400 text-black px-8 py-2 rounded-md font-semibold hover:bg-black hover:text-white transition-all duration-200 ease-in-out"
    >
      {children}
    </Link>
  );
};

export default Button2;
