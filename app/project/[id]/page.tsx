import { Link } from "@components/Link";
import ProjectButton from "@components/ProjectButton";
import { getProjectMetadata } from "@components/ProjectMetadata";
import ProjectTag from "@components/ProjectTag";
import fs from "fs";
import matter from "gray-matter";
import Markdown from "markdown-to-jsx";
import Image from "next/image";

const getProjectContent = (id: string) => {
  const folder = "content/";
  const file = `${folder}${id}.md`;
  const content = fs.readFileSync(file, "utf8");
  return matter(content);
};

export const generateStaticParams = async () => {
  const projects = getProjectMetadata();
  return projects.map((project) => ({
    id: project.id,
  }));
};

export default function Project(props: any) {
  const id = props.params.id;
  const project = getProjectContent(id);

  return (
    <section className="max-w-3xl mx-auto flex flex-col gap-4 md:gap-8 p-8">
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pb-2 md:pb-4">
            {project.data.title}
          </h1>
          {project.data.tags &&
            project.data.tags.map((tag: string) => (
              <ProjectTag key={tag} tag={tag} />
            ))}
        </div>
        <Image
          src={"/" + project.data.image}
          alt={project.data.title}
          width={500}
          height={500}
          className="w-full"
        />
        <div>
          {project.data.links &&
            project.data.links.map((link: any) => (
              <ProjectButton key={link.text} href={link.href}>
                {link.text}
              </ProjectButton>
            ))}
        </div>
      </div>
      <article className="prose sm:prose-base md:prose-lg lg:prose-xl xl:prose-2xl prose-p:text-gray-dark prose-headings:text-gray prose-a:text-blue">
        <Markdown
          options={{
            overrides: {
              a: {
                component: Link,
              },
            },
          }}
        >
          {project.content}
        </Markdown>
      </article>
    </section>
  );
}
