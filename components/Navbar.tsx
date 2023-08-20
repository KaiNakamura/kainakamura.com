import NavButton from '@components/NavButton';

export default function NavBar() {
  return (
    <nav className="bg-gray-dark">
      <div className="max-w-screen-xl flex flex-wrap mx-auto p-4 items-center justify-center flex-col sm:justify-between sm:flex-row">
        <NavButton text="Kai Nakamura" href="/" isHome />
        <ul className="font-medium flex p-0 rounded-lg flex-row space-x-8">
          <NavButton text="About" href="/#about" />
          <NavButton text="Projects" href="/#projects" />
          <NavButton text="Contact" href="/#contact" />
        </ul>
      </div>
    </nav>
  );
}
