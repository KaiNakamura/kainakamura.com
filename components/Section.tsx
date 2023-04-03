import type { FC, ReactNode } from "react";
import { HTMLAttributes } from "react";

export interface SectionProps extends HTMLAttributes<Element> {
  children?: ReactNode;
}

export const Section: FC<SectionProps> = ({
  children,
  ...rest
}: SectionProps) => {
  return (
    <section
      className="flex flex-col gap-14 p-10 md:gap-32 md:p-16 xl:gap-36 xl:p-16"
      {...rest}
    >
      {children}
    </section>
  );
};
