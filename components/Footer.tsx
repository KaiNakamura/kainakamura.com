import { Link } from "@components/Link";

export default function Footer() {
  return (
    <footer className="bg-gray-dark absolute w-full h-16 mt-16 flex justify-evenly items-center">
      <Link
        className="text-white hover:underline"
        href="https://github.com/KaiNakamura/kainakamura.com"
      >
        Source Code
      </Link>
      <Link
        className="text-white hover:underline"
        href="https://github.com/KaiNakamura/kainakamura.com/issues"
      >
        Report Bug
      </Link>
    </footer>
  );
}
