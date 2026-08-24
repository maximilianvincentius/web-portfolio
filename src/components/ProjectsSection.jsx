import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { projects } from "../data/projects";

const _renderProject = (p, i) => (
  <>
    {/* Project image with mock preview */}
    <div className="group relative h-44 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-no-repeat grayscale transition-all duration-500 group-hover:grayscale-0"
        style={{
          backgroundImage: `url(${p.image})`,
        }}
      />
      <span className="project-number absolute left-4 top-4 text-sm font-mono text-white/70">
        0{i + 1}
      </span>
    </div>

    {/* Project body */}
    <div className="flex flex-1 flex-col gap-3 p-5">
      <h3 className="text-lg font-bold text-white">{p.title}</h3>

      <p className="flex-1 text-sm leading-relaxed text-gray-400">
        {p.description.length > 200
          ? `${p.description.slice(0, 300)}...`
          : p.description}
      </p>

      {/* Pill container using flex-wrap to make items flow cleanly */}
      <div className="flex flex-wrap gap-2 my-2">
        {p.techStack.map((item, index) => (
          <span
            key={index}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 font-mono tracking-wide"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-3 justify-end">
        <a
          href={p.liveDemoUrl ? p.liveDemoUrl : p.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
        >
          {p.liveDemoUrl ? "Live Demo": "Repository"}<ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </>
);

const _renderSection = (projects, isProject = true, shouldAnimate = true) => {
  return projects.map((p, i) => (
    <motion.article
      key={p.id ?? p.title}
      initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      transition={
        shouldAnimate
          ? {
              duration: 0.5,
              delay: i * 0.12,
              ease: "easeOut",
            }
          : undefined
      }
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      {_renderProject(p, i)}
    </motion.article>
  ));
};

export default function ProjectsSection({ activeProject, onSelect }) {
  const [activeTab, setActiveTab] = useState("projects");
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  return (
    <section
      id="projects"
      className="section projects relative flex flex-col gap-10"
    >
      {/* Subtle background glows + grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Section heading */}
      <motion.div
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <span className="inline-block font-mono w-full max-w-xl text-sm text-primary">
            Explore my journey through projects, certifications, and technical
            expertise.
          </span>
          <span className="inline-block w-full text-4xl md:text-5xl font-bold text-white leading-tight text-center">
            Portfolio Showcase
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {_renderSection(projects)}
      </motion.div>
    </section>
  );
}
