import Card from "@components/Card";
import { ExternalLink } from "@components/ExternalLink";
import Hero from "@components/Hero";
import { Link } from "@components/Link";
import { getProjectMetadata } from "@components/ProjectMetadata";
import { Text } from "@components/Text";
import Head from "next/head";

export default function Home() {
  const projects = getProjectMetadata();

  return (
    <>
      <Head>
        <title>Kai Nakamura</title>
        <meta name="description" content="Kai Nakamura's Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <div className="flex flex-col gap-10 p-10 md:gap-14 md:p-14 xl:gap-18 xl:p-18">
        <section id="about" className="max-w-3xl m-auto flex flex-col gap-8">
          <Text>
            I&apos;m a student at{" "}
            <ExternalLink href="https://www.wpi.edu/">WPI</ExternalLink>{" "}
            pursuing a double-major in{" "}
            <ExternalLink href="https://www.wpi.edu/academics/departments/computer-science">
              Computer Science
            </ExternalLink>{" "}
            and{" "}
            <ExternalLink href="https://www.wpi.edu/academics/departments/robotics-engineering">
              Robotics Engineering
            </ExternalLink>
            .
          </Text>
          <Text>
            Check out some of the cool stuff I&apos;ve been working on below. If
            you&apos;ve got any questions or are interested in working with me
            feel free to <Link href="#contact">contact me</Link>.
          </Text>
        </section>
        <section id="projects" className="max-w-fit m-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-16">
            {projects.map((project) => (
              <Card key={project.id} project={project} />
            ))}
          </div>
        </section>
        <section id="contact">
          <Text>Contact</Text>
        </section>
      </div>
    </>
  );
}
