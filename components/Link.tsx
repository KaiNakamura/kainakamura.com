import type { AnchorHTMLAttributes, FC, ReactNode } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<Element> {
  href: string;
  internal?: boolean;
  children?: ReactNode;
}

export const Link: FC<LinkProps> = ({
  href,
  internal,
  children,
  rel,
  ...rest
}: LinkProps) => {
  const isInternalLink =
    internal != null
      ? internal
      : href.length > 0 && (href[0] === '/' || href[0] === '#');

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
