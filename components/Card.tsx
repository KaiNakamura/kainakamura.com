import Image from "next/image";
import { ProjectMetadata } from "@components/ProjectMetadata";
import Link from "next/link";

export interface CardProps {
  project: ProjectMetadata;
}

export default function Card({ project }: CardProps) {
  return (
    <Link href={"/project/" + project.id}>
      <div className="h-full max-w-xs md:max-w-sm rounded-3xl overflow-hidden shadow-xl">
        <Image
          src={"/" + project.image}
          alt={project.title}
          width={630}
          height={500}
        />
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h1 className="font-bold text-base md:text-lg lg:text-xl xl:text-2xl">
              {project.title}
            </h1>
            <p className="text-sm md:text-base lg:text-lg xl:text-xl">
              {project.description}
            </p>
          </div>
          <div>
            {project.tags &&
              project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block text-gray-light outline outline-1 outline-gray-light rounded-full px-2 py-0.5 md:px-3 md:py-1 font-semibold text-gray-700 mr-2 mb-2 text-xs md:text-sm"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
