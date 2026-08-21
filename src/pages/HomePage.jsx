import { useEffect, useState } from "react";

import BackgroundScene from "../components/BackgroundScene";
import Hero from "../components/Hero";
import ProjectsSection from "../components/ProjectsSection";
import CertificatesSection from '../components/CertificatesSection';

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
    <div className="my-10">
      <BackgroundScene />
      {/* Glows */}
      <div className="fixed -left-32 top-20 h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />
      <div className="fixed -right-32 bottom-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="fixed left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      <main className="px-10 md:px-20">
        <Hero />
        <ProjectsSection
          activeProject={activeProject}
          onSelect={selectProject}
        />
        <CertificatesSection/>
      </main>
    </div>
  );
}
