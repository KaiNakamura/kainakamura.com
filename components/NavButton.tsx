import Link from "next/link";

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
          ? "text-2xl font-bold whitespace-nowrap text-red hover:underline"
          : "text-xl text-white hover:text-blue-500"
      }
    >
      {text}
    </Link>
  );
}
