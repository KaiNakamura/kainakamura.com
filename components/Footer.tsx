import { Link } from "@components/Link";

export default function Footer() {
  return (
    <footer className="bg-gray-dark w-full h-16 flex justify-evenly items-center mt-auto">
      <Link
        className="text-white hover:underline text-xs md:text-sm lg:text-base xl:text-lg"
        href="https://github.com/KaiNakamura/kainakamura.com"
      >
        Source Code
      </Link>
      <Link
        className="text-white hover:underline text-xs md:text-sm lg:text-base xl:text-lg"
        href="https://github.com/KaiNakamura/kainakamura.com/issues"
      >
        Report Bug
      </Link>
    </footer>
  );
}
