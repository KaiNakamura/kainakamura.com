import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <section className="width-screen min-h-[65vh] bg-gray flex flex-col justify-center items-center">
        <div className="flex justify-center items-center gap-4 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          <div>
            <h1 className="text-white font-bold leading-none text-[10vw] xl:text-9xl">
              Hi, I&apos;m Kai
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
        <div className="min-h-[75px]"></div>
      </section>
      <div className="width-screen h-[75px] mt-[calc(-75px+2px)]">
        <div className="absolute bg-transparent w-0 h-0 left-[calc(50%-75px+1px)] border-solid border-b-[75px] border-b-white border-r-[75px] border-r-transparent"></div>
        <div className="absolute bg-transparent w-0 h-0 left-[calc(50%-1px)] border-solid border-b-[75px] border-b-white border-l-[75px] border-l-transparent"></div>
        <div className="absolute w-[calc(50%+2px)] h-[75px] left-[calc(-75px)] bg-white"></div>
        <div className="absolute w-[calc(50%-75px+2px)] h-[75px] left-[calc(50%+75px-2px)] bg-white"></div>
      </div>
    </div>
  );
}
