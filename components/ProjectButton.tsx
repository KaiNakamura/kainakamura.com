import { Link } from '@components/Link';
import { ReactNode } from 'react';

export interface ProjectButtonProps {
  href: string;
  children?: ReactNode;
}

export default function ProjectButton({ href, children }: ProjectButtonProps) {
  return (
    <button className="bg-green hover:bg-green-dark font-bold rounded-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 text-sm sm:text-base md:text-lg">
      <Link href={href} internal={false} className="text-white">
        {children}
      </Link>
    </button>
  );
}
