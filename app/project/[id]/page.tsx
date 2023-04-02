import fs from "fs";
import Markdown from "markdown-to-jsx";
import matter from "gray-matter";
import { getProjectMetadata } from "@components/ProjectMetadata";

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
    <>
      <h1>{project.data.title}</h1>
      <Markdown>{project.content}</Markdown>
    </>
  );
}
