import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { projects } from '../data/portfolio';

export default function ProjectCards({ activeProject, onSelect }) {
  const container = useRef(null);
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const cards = [...el.querySelectorAll('.bounce-card')];
    const mobile = matchMedia('(max-width: 768px)').matches;
    const transforms = mobile
      ? ['rotate(5deg) translate(-34px)','rotate(0deg) translate(0px)','rotate(-5deg) translate(34px)']
      : ['rotate(10deg) translate(-120px)','rotate(0deg) translate(0px)','rotate(-8deg) translate(100px)'];
    cards.forEach((card,i)=>{card.style.transform=transforms[i]||'none';card.style.scale=1;card.style.zIndex=cards.length-i;});
    const push = index => {
      gsap.killTweensOf(cards);
      cards.forEach((card,i)=>{
        const base=transforms[i]||'none';
        const rotateLess=base.replace(/rotate\([\s\S]*?\)/,'rotate(0deg)');
        if(i===index) gsap.to(card,{transform:rotateLess,scale:1,zIndex:10,duration:.4,ease:'back.out(1.4)'});
        else {
          const match=base.match(/translate\(([-0-9.]+)px\)/);
          const x=match?parseFloat(match[1]):0;
          const offset=mobile?(i<index?-58:58):(i<index?-100:100);
          gsap.to(card,{transform:base.replace(/translate\(([-0-9.]+)px\)/,`translate(${x+offset}px)`),scale:1,zIndex:5,duration:.4,delay:Math.abs(index-i)*.05,ease:'back.out(1.4)'});
        }
      });
    };
    const reset=()=>cards.forEach((c,i)=>gsap.to(c,{transform:transforms[i],scale:1,zIndex:cards.length-i,duration:.32,ease:'back.out(1.4)'}));
    const listeners=[];
    cards.forEach((card,i)=>{const enter=()=>push(i),leave=reset;card.addEventListener('mouseenter',enter);card.addEventListener('mouseleave',leave);card.addEventListener('touchstart',enter,{passive:true});card.addEventListener('touchend',leave,{passive:true});listeners.push([card,enter,leave]);});
    return ()=>listeners.forEach(([c,e,l])=>{c.removeEventListener('mouseenter',e);c.removeEventListener('mouseleave',l);c.removeEventListener('touchstart',e);c.removeEventListener('touchend',l);});
  }, []);
  return <div className="bounce-cards-container" id="bounceCards" ref={container}>
    {projects.map((p,i)=><div key={p.id} className={`bounce-card card-${i} ${activeProject===p.id?'synced-active':''}`} data-project={p.id} onClick={()=>onSelect(p.id)}>
      <div className="card-image"><img alt={`${p.title} Project`} src={p.image}/></div>
      <div className="card-content"><h3>{p.title}</h3><p>{p.description}</p><div className="card-links">
        <a className="btn btn-primary" href={p.visit} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>Visit</a>
        <a className="btn btn-github" href={p.github} target="_blank" rel="noreferrer" title="GitHub" onClick={e=>e.stopPropagation()}><img alt="GitHub" className="github-icon" src="/assets/github.svg"/></a>
      </div></div>
    </div>)}
  </div>;
}
