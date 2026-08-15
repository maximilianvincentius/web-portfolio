import { projectImpact, projects, timelineItems } from '../data/portfolio';

export default function Timeline({activeProject,onSelect}) {
  const data=projectImpact[activeProject];
  return <section className="section timeline-section" id="timeline">
    <h2>Build Timeline</h2>
    <div className="timeline-tabs">{projects.map(p=><button key={p.id} className={`timeline-tab ${activeProject===p.id?'active':''}`} type="button" onClick={()=>onSelect(p.id)}>{p.title}</button>)}</div>
    <article className="project-impact"><h3>{data.title}</h3><p>{data.summary}</p><div className="impact-grid">{data.metrics.map(x=><span className="impact-chip" key={x}>{x}</span>)}</div><div className="impact-next"><h4>What I’d Build Next</h4><ul>{data.next.map(x=><li key={x}>{x}</li>)}</ul></div></article>
    <div className="timeline-track">{timelineItems.filter(x=>x[0]===activeProject).map(([id,title,desc])=><article className="timeline-item" key={title}><span className="timeline-dot"/><div className="timeline-content"><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
  </section>;
}
