export interface ProjectTagProps {
  tag: string;
}

export default function ProjectTag({ tag }: ProjectTagProps) {
  return (
    <span className="inline-block text-gray-light outline outline-1 outline-gray-light rounded-full px-2 py-0.5 md:px-3 md:py-1 font-semibold text-gray-700 mr-2 mb-2 text-xs md:text-sm">
      {tag}
    </span>
  );
}
