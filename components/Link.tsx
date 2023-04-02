import type { AnchorHTMLAttributes, FC, ReactNode } from "react";

export interface LinkProps extends AnchorHTMLAttributes<Element> {
  href: string;
  children?: ReactNode;
}

export const Link: FC<LinkProps> = ({
  href,
  children,
  rel,
  ...rest
}: LinkProps) => (
  <a href={href} className="text-blue underline" {...rest}>
    {children ?? href}
  </a>
);
