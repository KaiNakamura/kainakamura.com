import fs from "fs";
import matter from "gray-matter";

export interface ProjectMetadata {
  id: string;
  title: string;
  description: string;
  image: string;
  tags?: string[];
}

export const getProjectMetadata = (): ProjectMetadata[] => {
  const folder = "content/";
  const files = fs.readdirSync(folder).filter((file) => file.endsWith(".md"));
  const projects = files.map((file) => {
    const contents = fs.readFileSync(`content/${file}`, "utf8");
    const matterResult = matter(contents);
    return {
      id: file.replace(".md", ""),
      title: matterResult.data.title,
      description: matterResult.data.description,
      image: matterResult.data.image,
      tags: matterResult.data.tags,
    };
  });
  return projects;
};
