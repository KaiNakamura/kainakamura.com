import Boids from '@components/Boids';
import { Link } from '@components/Link';
import Image from 'next/image';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';

export default function Hero() {
  return (
    <div className="relative overflow-hidden select-none">
      <div className="touch-none">
        <Boids />
        <section className="width-screen min-h-[65vh] bg-gray flex flex-col justify-center items-center">
          <div className="flex justify-center items-center gap-4 py-8 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16 relative z-10 pointer-events-none">
            <div>
              <h1 className="text-white font-bold leading-none text-[10vw] xl:text-9xl">
                Hi, I&apos;m Kai
              </h1>
              <h2 className="text-blue leading-none text-[3.75vw] xl:text-5xl">
                Software Dev / Student
              </h2>
            </div>
            <Image
              src="/kai-nakamura.jpg"
              alt="Kai Nakamura"
              width={320}
              height={320}
              priority={true}
              className="rounded-full max-w-[25vw] xl:max-w-[320px]"
            />
          </div>
          <div className="min-h-[75px]"></div>
        </section>
      </div>
      <div className="width-screen h-[75px] mt-[calc(-75px+2px)]">
        <div className="absolute bg-transparent w-0 h-0 left-[calc(50%-75px+1px)] border-solid border-b-[75px] border-b-white border-r-[75px] border-r-transparent"></div>
        <div className="absolute bg-transparent w-0 h-0 left-[calc(50%-1px)] border-solid border-b-[75px] border-b-white border-l-[75px] border-l-transparent"></div>
        <div className="absolute w-[calc(50%+2px)] h-[75px] left-[calc(-75px)] bg-white"></div>
        <div className="absolute w-[calc(50%-75px+2px)] h-[75px] left-[calc(50%+75px-2px)] bg-white"></div>
        <div className="absolute w-full h-[75px] flex flex-col">
          <div className="max-w-3xl mx-auto px-8 w-full h-full flex items-end gap-2 xs:gap-4 sm:gap-6 invisible min-[300px]:visible">
            <Link href="https://github.com/KaiNakamura">
              <FaGithub className="text-gray-light text-xl min-[400px]:text-3xl sm:text-4xl transition duration-300 ease-int-out hover:-translate-y-1 hover:text-gray" />
            </Link>
            <Link href="https://www.linkedin.com/in/kaihnakamura/">
              <FaLinkedin className="text-gray-light text-xl min-[400px]:text-3xl sm:text-4xl transition duration-300 ease-int-out hover:-translate-y-1 hover:text-gray" />
            </Link>
            <Link href="mailto:kaihnakamura@gmail.com">
              <HiMail className="text-gray-light text-xl min-[400px]:text-3xl sm:text-4xl transition duration-300 ease-int-out hover:-translate-y-1 hover:text-gray" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
