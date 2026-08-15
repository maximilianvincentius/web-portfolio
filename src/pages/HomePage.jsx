import { useEffect, useState } from "react";
import BackgroundScene from "../components/BackgroundScene";
import Hero, { ResumeLauncher } from "../components/Hero";
import ProjectsSection from "../components/ProjectsSection";
import Timeline from "../components/Timeline";
import Hobbies from "../components/Hobbies";
import CommandPalette from "../components/CommandPalette";

export default function HomePage() {
  const [recruiter, setRecruiter] = useState(
    () => localStorage.getItem("recruiterModeEnabled") === "true",
  );
  const [palette, setPalette] = useState(false);
  const [activeProject, setActiveProject] = useState("archive");
  useEffect(() => {
    const mobile = matchMedia("(max-width:768px)");
    const sync = () => {
      if (mobile.matches) {
        setRecruiter(false);
        localStorage.setItem("recruiterModeEnabled", "false");
      }
    };
    sync();
    mobile.addEventListener("change", sync);
    const key = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      mobile.removeEventListener("change", sync);
      window.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    document.body.classList.toggle("recruiter-mode", recruiter);
    return () => document.body.classList.remove("recruiter-mode");
  }, [recruiter]);
  const selectProject = (id) => {
    setActiveProject(id);
    window.dispatchEvent(
      new CustomEvent("portfolio:set-project", { detail: { projectId: id } }),
    );
  };
  const toggleRecruiter = () => {
    const next = !recruiter;
    setRecruiter(next);
    localStorage.setItem("recruiterModeEnabled", String(next));
  };
  const triggerResume = () =>
    document.querySelector(".footer-resume-launcher .resume-trigger")?.click();
  return (
    <>
      <BackgroundScene />
      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        onProject={(id) => {
          selectProject(id);
          document
            .getElementById("timeline")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        onRecruiter={toggleRecruiter}
        onResume={triggerResume}
      />
      <main>
        <Hero />
        <ProjectsSection
          activeProject={activeProject}
          onSelect={selectProject}
        />
        <Timeline activeProject={activeProject} onSelect={selectProject} />
        <Hobbies />
      </main>
      <footer>
        <div className="socials">
          <a
            href="https://github.com/squidward404"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a href="https://t.me/A_t_o_m_ic" target="_blank" rel="noreferrer">
            Telegram
          </a>
          <a href="mailto:befikirshimelis20@gmail.com">Gmail</a>
        </div>
        <ResumeLauncher footer />
      </footer>
    </>
  );
}
