import { ReactNode } from "react";
import { Link } from "@components/Link";

export interface ProjectButtonProps {
  href: string;
  children?: ReactNode;
}

export default function ProjectButton({ href, children }: ProjectButtonProps) {
  return (
    <button className="bg-green font-bold rounded-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 mr-2 mb-2 text-sm sm:text-base md:text-lg">
      <Link href={href} className="text-white">
        {children}
      </Link>
    </button>
  );
}
