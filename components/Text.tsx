import type { FC, HTMLAttributes, ReactNode } from "react";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export const Text: FC<TextProps> = ({ children, ...rest }: TextProps) => (
  <p className="sm:text-base md:text-lg lg:text-xl xl:text-2xl" {...rest}>
    {children}
  </p>
);
