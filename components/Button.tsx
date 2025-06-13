import Link from 'next/link';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  route: string;
};

const Button = ({ children, route }: ButtonProps) => {
  return (
    <Link
      href={route}
      className="px-8 py-2 bg-white rounded-md text-black relative font-semibold overflow-hidden hover:bg-orange-100 transition-all duration-200 ease-in-out"
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
};

export default Button;
