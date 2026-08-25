import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/projects";

const ExpandableText = ({ text, limit = 200 }) => {
  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState("auto");

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const tooLong = text.length > limit;
  const collapsedText = `${text.slice(0, limit)}...`;

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const contentHeight = contentRef.current.scrollHeight;

    setHeight(contentHeight);
  }, [expanded, text]);

  if (!tooLong) {
    return (
      <p className="text-sm leading-relaxed text-gray-400">
        {text}
      </p>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      animate={{
        height,
      }}
      initial={false}
      transition={{
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="relative overflow-hidden"
    >
      <div
        ref={contentRef}
        className="text-sm leading-relaxed text-gray-400"
      >
        {expanded ? text : collapsedText}

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="ml-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
        >
          {expanded ? "less" : "more"}
        </button>
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      {/* Project Image */}
      <div className="relative h-44 shrink-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat grayscale transition-all duration-500 group-hover:grayscale-0"
          style={{
            backgroundImage: `url(${project.image})`,
          }}
        />

        <span className="absolute left-4 top-4 font-mono text-sm text-white/70">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Project Body */}
      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-white">
          {project.title}
        </h3>

        <ExpandableText
          text={project.description}
          limit={200}
        />

        {/* Tech Stack */}
        <div className="my-2 flex flex-wrap gap-2">
          {project.techStack.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs tracking-wide text-gray-300"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Link */}
        <div className="mt-2 flex items-center justify-end">
          <a
            href={
              project.liveDemoUrl
                ? project.liveDemoUrl
                : project.githubUrl
            }
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
          >
            {project.liveDemoUrl ? "Live Demo" : "Repository"}

            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
};

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="section projects relative flex flex-col gap-10"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Heading */}
      <motion.div
        className="mt-20 text-center"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <span className="inline-block w-full max-w-xl font-mono text-sm text-primary">
          Explore my journey through projects, certifications, and
          technical expertise.
        </span>

        <span className="block text-4xl font-bold leading-tight text-white md:text-5xl">
          Portfolio Showcase
        </span>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id ?? project.title}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}