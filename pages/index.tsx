import Hero from "@components/Hero";
import Head from "next/head";
import { ExternalLink } from "@components/ExternalLink";
import { Text } from "@components/Text";
import { Link } from "@components/Link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kai Nakamura</title>
        <meta name="description" content="Kai Nakamura's Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <section id="about" className="max-w-3xl m-auto p-12 flex flex-col gap-8">
        <Text>
          I'm a student at{" "}
          <ExternalLink href="https://www.wpi.edu/">WPI</ExternalLink> pursuing
          a double-major in{" "}
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
          Check out some of the cool stuff I've been working on below. If you've
          got any questions or are interested in working with me feel free to{" "}
          <Link href="#contact">contact me</Link>.
        </Text>
      </section>
      <section id="projects">
        <Text>Projects</Text>
      </section>
      <section id="contact">
        <Text>Contact</Text>
      </section>
    </>
  );
}
