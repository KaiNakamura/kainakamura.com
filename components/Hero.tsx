import Image from "next/image";

export default function Hero() {
  return (
    <section className="width-screen min-h-[65vh] bg-gray flex justify-center items-center">
      <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
        <div>
          <h1 className="text-white font-bold leading-none text-[10vw] xl:text-9xl">
            Hi, I'm Kai
          </h1>
          <h2 className="text-blue leading-none text-[3.75vw] xl:text-5xl">
            Software Dev / Student
          </h2>
        </div>
        <Image
          src="/kai-nakamura.png"
          alt="Kai Nakamura"
          width={320}
          height={320}
          className="rounded-full max-w-[25vw] xl:max-w-[320px]"
        />
      </div>
    </section>
  );
}
