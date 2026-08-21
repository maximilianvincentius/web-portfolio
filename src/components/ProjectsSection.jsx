import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "IntervueAI",
    description:
      "Real-time mock interviews with AI, no forms or clicks just natural, personalized conversations.",
    gradient: "linear-gradient(135deg,#25133e,#5d2b86,#1c1633)",
    liveDemoUrl: "#",
    techStack: ["Node.js", "Express.js", "MongoDB", "Docker", "Redis"],
  },
  {
    title: "Blendy",
    description:
      "A social app where you can connect in real-time, log in with one click, share moments, and post instantly.",
    gradient: "linear-gradient(135deg,#0d3840,#126b69,#17314a)",
    liveDemoUrl: "#",
    techStack: ["React", "Tailwind"],
  },
  {
    title: "WATCHit",
    description:
      "A video streaming app made for easy, personal entertainment and everything you love to binge.",
    gradient: "linear-gradient(135deg,#391818,#8a3030,#251a2d)",
    liveDemoUrl: "#",
    techStack: ["React", "Tailwind"],
  },
  {
    title: "NovaTrack",
    description:
      "A GPS tracking and fleet management solution for logistics companies.",
    gradient: "linear-gradient(135deg,#0f3460,#533574,#1a1f3f)",
    liveDemoUrl: "#",
    techStack: ["React", "Tailwind"],
  },
  {
    title: "Emerge",
    description:
      "A decentralized marketplace for digital creators to launch and sell work.",
    gradient: "linear-gradient(135deg,#6e45e2,#a855f7,#d53f8c)",
    liveDemoUrl: "#",
    techStack: ["React", "Tailwind"],
  },
  {
    title: "Flow",
    description:
      "A real-time collaborative whiteboard for teams to brainstorm and draw together.",
    gradient: "linear-gradient(135deg,#1e40af,#3b82f6,#60a5fa)",
    liveDemoUrl: "#",
    techStack: ["React", "Tailwind"],
  },
];

const certificates = [
  {
    id: "google-data-analytics",
    title: "Google Advanced Data Analytics",
    issuer: "Google Career Certificates",
    date: "June 2023",
  },
  {
    id: "meta-frontend",
    title: "Meta Front-End Developer",
    issuer: "Meta",
    date: "September 2022",
  },
  {
    id: "aws-solutions",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "March 2023",
  },
  {
    id: "azure-fundamentals",
    title: "Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    date: "January 2023",
  },
];

const _renderProject = (p, i) => (
  <>
    {/* Project image with mock preview */}
    <div className="relative h-44 overflow-hidden">
      <div className="absolute inset-0" style={{ background: p.gradient }} />
      {/* Mock browser preview overlay */}
      <div className="mock-window absolute inset-x-4 bottom-4 rounded-lg border border-white/15 bg-black/30 p-3 backdrop-blur-sm">
        <div className="dots flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-white/40" />
          <i className="h-2 w-2 rounded-full bg-white/40" />
          <i className="h-2 w-2 rounded-full bg-white/40" />
        </div>
        <div className="mock-line mt-2 h-2 w-3/4 rounded bg-white/20" />
        <div className="mock-line mt-1.5 h-2 w-1/2 rounded bg-white/15" />
        <div className="mock-blocks mt-2 flex gap-1.5">
          <b className="h-5 w-5 rounded bg-white/20" />
          <b className="h-5 w-5 rounded bg-white/15" />
          <b className="h-5 w-5 rounded bg-white/10" />
        </div>
      </div>
      <span className="project-number absolute left-4 top-4 text-sm font-mono text-white/70">
        0{i + 1}
      </span>
    </div>

    {/* Project body */}
    <div className="flex flex-1 flex-col gap-3 p-5">
      <h3 className="text-lg font-bold text-white">{p.title}</h3>

      <p className="flex-1 text-sm leading-relaxed text-gray-400">
        {p.description}
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

      <div className="mt-2 flex items-center gap-3">
        <a
          href={p.liveDemoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
        >
          Live Demo <ArrowUpRight className="h-4 w-4" />
        </a>
        <button
          type="button"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-200 transition-colors hover:bg-white/10"
        >
          Details
        </button>
      </div>
    </div>
  </>
);

const _renderCertificates = (c, i) => (
  <>
    <div
      className="relative h-32 overflow-hidden"
      style={{
        background: c.gradient || "linear-gradient(135deg,#6366f1,#8b5cf6)",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
      {/* <Award className="absolute right-4 top-4 h-7 w-7 text-white/80" /> */}
    </div>
    <div className="flex flex-1 flex-col gap-2 p-5">
      <h3 className="text-base font-bold text-white">{c.title}</h3>
      <p className="text-sm text-gray-400">{c.issuer}</p>
      <p className="mt-auto text-xs text-gray-500">{c.date}</p>
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
      {isProject ? _renderProject(p, i) : _renderCertificates(p, i)}
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
        // className="flex flex-col sm:flex-row gap-y-5 mt-20 justify-between align-middle"
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
        // className="self-center flex flex-col gap-y-5"
          className="text-center"
        >
          <span className="inline-block font-mono w-full max-w-xl text-sm text-primary">
            Explore my journey through projects, certifications, and technical
            expertise.
          </span>
          <span className="inline-block w-full text-4xl md:text-5xl font-bold text-white leading-tight text-center">Portfolio Showcase</span>
        </div>
        {/* <div className="w-full self-center grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/4 p-2 backdrop-blur-xl sm:max-w-md">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex flex-col items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === "projects"
                ? "bg-gradient-to-br from-purple-500/50 to-indigo-500/40 text-white shadow-[0_0_25px_-5px_rgba(168,85,247,0.6)]"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex flex-col items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
              activeTab === "certificates"
                ? "bg-gradient-to-br from-purple-500/50 to-indigo-500/40 text-white shadow-[0_0_25px_-5px_rgba(168,85,247,0.6)]"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            Certificates
          </button>
        </div> */}
      /* </motion.div>

      {/* Projects content */}
      {activeTab === "projects" && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {_renderSection(projects) }
          {/* {_renderSection(showAllProjects ? projects : projects.slice(0, 3))} */}


          {/* See More / Show Less */}
          {/* {projects.length > 3 && (
            <div className="col-span-full mt-4 flex justify-start">
              <button
                type="button"
                onClick={() => setShowAllProjects((v) => !v)}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 backdrop-blur-xl transition-all hover:border-purple-400/40 hover:bg-white/10 hover:text-white"
              >
                {showAllProjects ? "Show Less" : "See More"}
                {showAllProjects ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
              </button>
            </div>
          )} */}
        </motion.div>
      )}

      {/* Certificates content */}
      {activeTab === "certificates" && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {_renderSection(
            showAllCertificates ? certificates : certificates.slice(0, 3),
            false,
          )}
        </motion.div>
      )}
    </section>
  );
}
