import Card from "@components/Card";
import Hero from "@components/Hero";
import { Link } from "@components/Link";
import { getProjectMetadata } from "@components/ProjectMetadata";
import { Section } from "@components/Section";
import { Text } from "@components/Text";
import { HiOutlineMail } from "react-icons/hi";
import { GrDocumentUser } from "react-icons/gr";

export default function Home() {
  const projects = getProjectMetadata();

  return (
    <>
      <Hero />
      <div className="flex flex-col">
        <Section
          id="about"
          className="max-w-3xl m-auto flex flex-col gap-8 px-8 py-20"
        >
          <Text>
            I&apos;m a student at <Link href="https://www.wpi.edu/">WPI</Link>{" "}
            pursuing a double-major in{" "}
            <Link href="https://www.wpi.edu/academics/departments/computer-science">
              Computer Science
            </Link>{" "}
            and{" "}
            <Link href="https://www.wpi.edu/academics/departments/robotics-engineering">
              Robotics Engineering
            </Link>
            .
          </Text>
          <Text>
            Check out some of the cool stuff I&apos;ve been working on below. If
            you&apos;ve got any questions or are interested in working with me
            feel free to <Link href="#contact">contact me</Link>.
          </Text>
        </Section>
        <Section id="projects" className="bg-white-dark px-8 py-40">
          <div className="max-w-fit m-auto">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-16">
              {projects.map((project) => (
                <Card key={project.id} project={project} />
              ))}
            </div>
          </div>
        </Section>
        <Section
          id="contact"
          className="max-w-3xl m-auto flex flex-col gap-8 px-8 py-40"
        >
          <div className="flex justify-center">
            <Text className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              Contact Me
            </Text>
          </div>
          <Text>
            You can reach out to me with questions, comments, or concerns
            through email, and I will get back to you as soon as possible.
          </Text>
          <div className="max-w-fit m-auto">
            <div className="grid sm:grid-cols-2 gap-8">
              <Link
                href="mailto:kaihnakamura@gmail.com"
                className="text-gray-dark"
              >
                <div className="bg-white-light outline outline-1 outline-white-dark h-full max-w-xs md:max-w-sm rounded-xl overflow-hidden shadow-lg">
                  <div className="flex flex-col p-8 items-center">
                    <HiOutlineMail className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl" />
                    <h1 className="font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl">
                      Email
                    </h1>
                    <p className="text-blue underline text-sm md:text-base lg:text-lg xl:text-xl">
                      kaihnakamura@gmail.com
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="resume.pdf" className="text-gray-dark">
                <div className="bg-white-light outline outline-1 outline-white-dark h-full max-w-xs md:max-w-sm rounded-xl overflow-hidden shadow-lg">
                  <div className="flex flex-col p-8 items-center">
                    <GrDocumentUser className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl" />
                    <h1 className="font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl">
                      Resume
                    </h1>
                    <p className="text-blue underline text-sm md:text-base lg:text-lg xl:text-xl">
                      Download PDF
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
