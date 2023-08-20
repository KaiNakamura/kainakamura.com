import ProjectTag from '@components/ProjectTag';
import { ProjectMetadata } from '@util/ProjectMetadata';
import Image from 'next/image';
import Link from 'next/link';

export interface CardProps {
  project: ProjectMetadata;
}

export default function Card({ project }: CardProps) {
  return (
    <Link href={'/project/' + project.id}>
      <div className="bg-white h-full max-w-xs md:max-w-sm rounded-3xl overflow-hidden shadow-xl transition duration-300 ease-in-out hover:-translate-y-4 hover:-translate-x-0.5 hover:shadow-2xl">
        <Image
          src={'/' + project.image}
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
              project.tags.map((tag) => <ProjectTag key={tag} tag={tag} />)}
          </div>
        </div>
      </div>
    </Link>
  );
}
