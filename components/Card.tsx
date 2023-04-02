import Image from "next/image";
import { ProjectMetadata } from "@components/ProjectMetadata";
import Link from "next/link";

export interface CardProps {
  project: ProjectMetadata;
}

export default function Card({ project }: CardProps) {
  return (
    <Link href={"/project/" + project.id}>
      <div className="max-w-xs md:max-w-sm rounded-3xl overflow-hidden shadow-xl">
        <Image
          src={"/" + project.image}
          alt="Liar's Dice"
          width={630}
          height={500}
        />
        <div className="px-6 py-4">
          <h1 className="font-bold text-base md:text-lg lg:text-xl xl:text-2xl">
            {project.title}
          </h1>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl">
            {project.description}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #photography
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #travel
          </span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            #winter
          </span>
        </div>
      </div>
    </Link>
  );
}
