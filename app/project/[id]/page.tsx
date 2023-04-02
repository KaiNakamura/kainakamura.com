import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import { getProjectMetadata } from "@components/ProjectMetadata";
import { Link } from "@components/Link";

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
    <section className="max-w-3xl m-auto flex flex-col gap-8 p-8">
      <article className="prose sm:prose-base md:prose-lg lg:prose-xl xl:prose-2xl prose-p:text-gray-dark prose-headings:text-gray prose-a:text-blue">
        <h1>{project.data.title}</h1>
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
