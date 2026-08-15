import ProjectCards from './ProjectCards';
export default function ProjectsSection({activeProject,onSelect}) {
  return <section className="section projects-section" id="projects"><h2>Projects</h2><ProjectCards activeProject={activeProject} onSelect={onSelect}/></section>;
}
