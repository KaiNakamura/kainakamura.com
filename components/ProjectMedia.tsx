import Image from 'next/image';

export interface ProjectMediaProps {
  title: string;
  media: string;
  image: string;
}

export default function ProjectMedia({
  title,
  media,
  image,
}: ProjectMediaProps) {
  const isMp4 = media && media.includes('.mp4');
  const isYoutube = media && media.includes('www.youtube.com');

  if (isMp4) {
    return (
      <video className="w-full bg-gray" width="854" height="480" controls>
        <source src={`/${media}`} type="video/mp4" />
      </video>
    );
  } else if (isYoutube) {
    return (
      <iframe
        className="w-full aspect-video"
        src={media}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    );
  } else {
    return (
      <Image
        src={`/${image}`}
        alt={title}
        width={500}
        height={500}
        priority={true}
        className="w-full"
      />
    );
  }
}
