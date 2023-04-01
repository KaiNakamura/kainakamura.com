import NavButton from "@components/NavButton";
import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-neutral-800">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavButton text="Kai Nakamura" href="/" isHome />
        <ul className="font-medium flex p-0 rounded-lg flex-row space-x-8">
          <NavButton text="About" href="/about" />
          <NavButton text="Projects" href="/projects" />
          <NavButton text="Contact" href="/contact" />
        </ul>
      </div>
    </nav>
  );
}
