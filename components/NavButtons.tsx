import NavButton from "@components/NavButton";

export default function NavButtons() {
  return (
    <>
      <NavButton text="Projects" href="/projects" />
      <NavButton text="Games" href="/games" />
      <NavButton text="Music" href="/music" />
      <NavButton text="Contact" href="/contact" />
    </>
  );
}
