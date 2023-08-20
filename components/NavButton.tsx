import Link from 'next/link';

export interface NavButtonProps {
  text: string;
  href: string;
  isHome?: boolean;
}

export default function NavButton({
  text,
  href,
  isHome = false,
}: NavButtonProps) {
  return (
    <Link
      href={href}
      className={
        isHome
          ? 'sm:text-2xl text-xl font-bold whitespace-nowrap text-red hover:underline'
          : 'sm:text-xl text-lg text-white hover:underline hover:text-blue'
      }
      scroll={false}
    >
      {text}
    </Link>
  );
}
