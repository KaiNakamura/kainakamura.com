'use client';

import Card from '@components/Card';
import { Section } from '@components/Section';
import { ProjectMetadata } from '@util/ProjectMetadata';
import { useEffect, useState } from 'react';

export interface ProjectsSectionProps {
  projects: ProjectMetadata[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // A dictionary that keeps track of which project ids are currently focused
  const [focusedProjects, setFocusedProjects] = useState<{
    [id: string]: boolean;
  }>(
    // Create initial object with project ids all set to false
    Object.assign({}, ...projects.map((project) => ({ [project.id]: false })))
  );

  // The id of the current previewed project
  const [previewedProject, setPreviewedProject] = useState<string | null>(null);

  const handleFocusChange = (focused: boolean, id: string) => {
    focusedProjects[id] = focused;
    setFocusedProjects({ ...focusedProjects });
  };

  useEffect(() => {
    // Set the previewed project to the first focused project
    for (const id of Object.keys(focusedProjects)) {
      if (focusedProjects[id]) {
        setPreviewedProject(id);
        return;
      }
    }

    // Otherwise if no project found, set to null
    setPreviewedProject(null);
  }, [focusedProjects]);

  return (
    <Section
      id="projects"
      className="bg-white-dark px-8 py-16 md:py-24 lg:py-32 xl:py-40"
    >
      <div className="max-w-fit m-auto">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-16">
          {projects.map((project) => (
            <Card
              key={project.id}
              project={project}
              previewed={project.id == previewedProject}
              onFocusChange={handleFocusChange}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
