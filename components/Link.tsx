import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<Element> {
  href: string;
  children?: ReactNode;
}

export const Link: FC<LinkProps> = ({
  href,
  children,
  rel,
  ...rest
}: LinkProps) => {
  const isInternalLink =
    href.length > 0 && (href[0] === '/' || href[0] === '#');

  if (isInternalLink) {
    return (
      <a href={href} className="text-blue underline" {...rest}>
        {children ?? href}
      </a>
    );
  } else {
    return (
      <a
        target="_blank"
        rel={`noopener noreferrer${rel ? ` ${rel}` : ''}`}
        href={href}
        className="text-blue underline"
        {...rest}
      >
        {children ?? href}
      </a>
    );
  }
};
