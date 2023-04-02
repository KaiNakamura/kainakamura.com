import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import { getProjectMetadata } from "@components/ProjectMetadata";
import { Link } from "@components/Link";
import Image from "next/image";
import { Text } from "@components/Text";

const getProjectContent = (id: string) => {
  const folder = "content/";
  const file = `${folder}${id}.md`;
  const content = fs.readFileSync(file, "utf8");
  return matter(content);
};

export const generateStaticParams = async () => {
  const projects = getProjectMetadata();
  return projects.map((project) => project.id);
};

export default function Project(props: any) {
  const id = props.params.id;
  const project = getProjectContent(id);

  return (
    <section className="max-w-3xl m-auto p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 md:gap-8">
          <div>
            <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pb-2 md:pb-4">
              {project.data.title}
            </h1>
            {project.data.tags &&
              project.data.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block text-gray-light outline outline-1 outline-gray-light rounded-full px-3 py-1 font-semibold text-gray-700 mr-2 mb-2 text-[0.5rem] sm:text-xs md:text-sm"
                >
                  {tag}
                </span>
              ))}
          </div>
          <Image
            src={"/" + project.data.image}
            alt={project.data.title}
            width={500}
            height={500}
            className="w-full"
          />
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
      </div>
    </section>
  );
}
