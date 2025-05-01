import Code from '@components/Code';
import CodeWrapper from '@components/CodeWrapper';
import { Link } from '@components/Link';
import ProjectButton from '@components/ProjectButton';
import ProjectMedia from '@components/ProjectMedia';
import ProjectTag from '@components/ProjectTag';
import { getProjectMetadata } from '@util/ProjectMetadata';
import fs from 'fs';
import matter from 'gray-matter';
import { compiler } from 'markdown-to-jsx';

const getProjectContent = (id: string) => {
  const folder = 'content/';
  const file = `${folder}${id}.md`;
  const content = fs.readFileSync(file, 'utf8');
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
    <section className="max-w-3xl mx-auto flex flex-col p-8 gap-4 md:gap-8">
      <div>
        <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pb-2 md:pb-4">
          {project.data.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {project.data.tags &&
            project.data.tags.map((tag: string) => (
              <ProjectTag key={tag} tag={tag} />
            ))}
        </div>
      </div>
      <ProjectMedia
        title={project.data.title}
        media={project.data.media}
        image={project.data.image}
      />
      <div className="flex flex-wrap gap-4">
        {project.data.links &&
          project.data.links.map((link: { text: string; href: string }) => (
            <ProjectButton key={link.text} href={link.href}>
              {link.text}
            </ProjectButton>
          ))}
      </div>
      <article className="prose sm:prose-base md:prose-lg lg:prose-xl xl:prose-2xl prose-p:text-gray-dark prose-headings:text-gray prose-a:text-blue marker:text-gray-dark">
        {compiler(project.content, {
          wrapper: null,
          forceWrapper: true,
          overrides: {
            a: {
              component: Link,
            },
            pre: {
              component: CodeWrapper,
            },
            code: {
              component: (props) => (
                <Code language="python" text={props.children} />
              ),
            },
          },
        })}
      </article>
    </section>
  );
}
