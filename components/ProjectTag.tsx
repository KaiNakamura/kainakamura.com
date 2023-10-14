export interface ProjectTagProps {
  tag: string;
}

export default function ProjectTag({ tag }: ProjectTagProps) {
  return (
    <span className="inline-block text-gray-light border border-1 border-gray-light rounded-full px-2 py-0.5 md:px-3 md:py-1 font-semibold text-xs md:text-sm">
      {tag}
    </span>
  );
}
