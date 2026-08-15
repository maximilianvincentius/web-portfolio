import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useParticles() {
  useEffect(() => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    canvas.width = width; canvas.height = height;
    const particles = Array.from({ length: mobile ? 32 : 72 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      size: Math.random() * 1.6 + 0.9, alpha: Math.random() * 0.3 + 0.22,
    }));
    let mouseX = 0, mouseY = 0, frame;
    const onMove = e => { mouseX = e.clientX; mouseY = e.clientY; };
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width; canvas.height = height;
    };
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        const dx = mouseX - p.x, dy = mouseY - p.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0.001 && distance < 120) {
          const force = (120 - distance) / 120;
          p.x -= (dx / distance) * force * 1.35;
          p.y -= (dy / distance) * force * 1.35;
        }
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`; ctx.fill();
      });
      frame = requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);
    animate();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);
}

export function useTypingEffect() {
  useEffect(() => {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const part1 = "Hi, I'm ", part2 = "Befikir", part3 = "\nFull Stack Developer";
    let i = 0, part = 1, timer;
    const type = () => {
      if (part === 1) {
        el.textContent = part1.slice(0, ++i);
        if (i >= part1.length) { part = 2; i = 0; }
      } else if (part === 2) {
        i++;
        el.innerHTML = `${part1}<span class="highlight">${part2.slice(0, i)}</span>`;
        if (i >= part2.length) { part = 3; i = 0; }
      } else {
        i++;
        el.innerHTML = `${part1}<span class="highlight">${part2}</span>${part3.slice(0, i)}`;
        if (i >= part3.length) return;
      }
      timer = setTimeout(type, 75);
    };
    timer = setTimeout(type, 500);
    return () => clearTimeout(timer);
  }, []);
}

export function useThreeScene() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 12;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(10, 10, 5); scene.add(directional);
    const point = new THREE.PointLight(0x7317cf, 1, 20);
    point.position.set(5, 5, 5); scene.add(point);

    const group = new THREE.Group();
    group.position.set(2, 0, 0); group.rotation.z = 0.5; scene.add(group);
    const initial = { pos: [2,0,0], rot: [0,0,0.5], scale: [1,1,1] };

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, mobile ? 36 : 64, mobile ? 36 : 64),
      new THREE.MeshPhongMaterial({ map: makeSaturnTexture(), bumpScale: 0.05, specular: new THREE.Color(0x333333), shininess: 5 })
    );
    group.add(sphere);

    const ringTexture = makeRingTexture();
    const inner = new THREE.Mesh(
      new THREE.RingGeometry(2.5, 4, mobile ? 42 : 64),
      new THREE.MeshPhongMaterial({ map: ringTexture, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
    );
    inner.rotation.x = Math.PI / 2; group.add(inner);
    const outer = new THREE.Mesh(
      new THREE.RingGeometry(4, 5.5, mobile ? 42 : 64),
      new THREE.MeshPhongMaterial({ map: ringTexture, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false })
    );
    outer.rotation.x = Math.PI / 2; group.add(outer);

    const stars = makeStarField(mobile ? 340 : 760, 120, mobile ? 0.085 : 0.11, 0.6, 0xffffff);
    const slowStars = makeStarField(mobile ? 140 : 300, 170, mobile ? 0.11 : 0.16, 0.2, 0xb8d4ff);
    scene.add(stars, slowStars);

    const pointer = { x: 0, y: 0 };
    const onMove = e => {
      pointer.x = ((e.clientX / innerWidth) - 0.5) * (mobile ? 0.35 : 0.7);
      pointer.y = ((e.clientY / innerHeight) - 0.5) * (mobile ? 0.15 : 0.35);
    };
    window.addEventListener('mousemove', onMove);

    let cometHead, cometTrail, trailAttr, cometPoints = [];
    const cometState = { active:false, progress:0, nextSpawnAt:performance.now() + (mobile?4200:3200), start:new THREE.Vector3(), end:new THREE.Vector3() };
    if (!mobile) {
      cometHead = new THREE.Mesh(new THREE.SphereGeometry(0.08,14,14), new THREE.MeshBasicMaterial({color:0xbfe7ff,transparent:true,opacity:0.95}));
      cometHead.visible=false; scene.add(cometHead);
      const count=26, positions=new Float32Array(count*3);
      for(let i=0;i<count;i++) cometPoints.push(new THREE.Vector3(9999,9999,9999));
      trailAttr=new THREE.BufferAttribute(positions,3);
      const geo=new THREE.BufferGeometry(); geo.setAttribute('position',trailAttr);
      cometTrail=new THREE.Line(geo,new THREE.LineBasicMaterial({color:0x7ac8ff,transparent:true,opacity:0.58,blending:THREE.AdditiveBlending,depthWrite:false}));
      cometTrail.visible=false; scene.add(cometTrail);
    }
    const spawn = now => {
      cometState.active=true; cometState.progress=0;
      cometState.start.set(-14-Math.random()*4,5+Math.random()*4,-8-Math.random()*6);
      cometState.end.set(13+Math.random()*4,-4-Math.random()*2.5,-2+Math.random()*3);
      cometHead.position.copy(cometState.start); cometHead.visible=true; cometTrail.visible=true;
      cometPoints.forEach(p=>p.copy(cometState.start));
      cometState.nextSpawnAt=now+3400+Math.random()*4600;
    };

    const reset = () => {
      group.position.set(...initial.pos); group.rotation.set(...initial.rot); group.scale.set(...initial.scale);
    };
    const finalPose = () => { group.position.set(0,-3,0); group.rotation.set(0,0,0); group.scale.set(.6,.6,.6); };
    reset();

    const master = gsap.timeline({
      defaults:{ease:'none'},
      scrollTrigger:{
        trigger:'body', start:mobile?'top+=40 top':'top top', end:'bottom bottom',
        scrub:mobile?.45:1.5, invalidateOnRefresh:!mobile, fastScrollEnd:!mobile,
        onUpdate:self=>{if(mobile&&self.progress>=.985)finalPose();},
        onLeave:()=>mobile&&finalPose(), onLeaveBack:()=>mobile&&reset(),
        onRefresh:()=>{if(mobile&&scrollY<=2)reset(); else if(mobile&&(innerHeight+scrollY)>=document.documentElement.scrollHeight-2)finalPose();}
      }
    });
    master.to(group.position,{x:-2,y:0,z:0,duration:1},0);
    master.to(group.rotation,{x:0,y:Math.PI*.3,z:0,duration:1},0);
    master.to(group.position,{x:1.5,y:-.5,z:0,duration:1},1);
    master.to(group.rotation,{x:0,y:Math.PI*.6,z:0,duration:1},1);
    master.to(group.scale,{x:.7,y:.7,z:.7,duration:1},1);
    master.to(group.position,{x:0,y:-3,z:0,duration:1},2);
    master.to(group.rotation,{x:0,y:0,z:0,duration:1},2);
    master.to(group.scale,{x:.6,y:.6,z:.6,duration:1},2);

    let cosmic=0, frame;
    const animate = now => {
      frame=requestAnimationFrame(animate); cosmic+=.01;
      sphere.rotation.y += mobile?.0011:.002; inner.rotation.z += .0009;
      stars.rotation.y += .00015; stars.rotation.x=pointer.y*.022;
      slowStars.rotation.y -= .0001; slowStars.rotation.x=pointer.y*.014;
      camera.position.x += (pointer.x-camera.position.x)*.035;
      camera.position.y += (pointer.y-camera.position.y)*.035;
      point.intensity=1+Math.sin(cosmic*.72)*.12;
      if(!mobile&&cometHead&&cometTrail){
        if(!cometState.active && now>=cometState.nextSpawnAt) spawn(now);
        if(cometState.active){
          cometState.progress += .016;
          if(cometState.progress>=1){cometState.active=false;cometHead.visible=false;cometTrail.visible=false;}
          else {
            cometHead.position.lerpVectors(cometState.start,cometState.end,cometState.progress);
            for(let i=cometPoints.length-1;i>0;i--) cometPoints[i].copy(cometPoints[i-1]);
            cometPoints[0].copy(cometHead.position);
            for(let i=0;i<cometPoints.length;i++){const p=cometPoints[i]; trailAttr.array[i*3]=p.x;trailAttr.array[i*3+1]=p.y;trailAttr.array[i*3+2]=p.z;}
            trailAttr.needsUpdate=true;
          }
        }
      }
      renderer.render(scene,camera);
    };
    animate();

    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,window.matchMedia('(max-width:768px)').matches?1.5:2));ScrollTrigger.refresh();};
    window.addEventListener('resize',resize);

    const techTween=gsap.fromTo('.tech-icon',{y:30,opacity:0},{y:0,opacity:1,duration:.6,stagger:.1,ease:'power2.out',scrollTrigger:{trigger:'#hero',start:'top 80%',toggleActions:'play none none none'}});
    const socialTween=gsap.from('.socials a',{scrollTrigger:{trigger:'footer',start:'top 85%'},y:20,opacity:0,duration:.5,stagger:.1,ease:'power1.out'});

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('resize',resize);
      master.scrollTrigger?.kill(); master.kill(); techTween.scrollTrigger?.kill(); techTween.kill(); socialTween.scrollTrigger?.kill(); socialTween.kill();
      renderer.dispose();
      scene.traverse(obj=>{ if(obj.geometry) obj.geometry.dispose(); if(obj.material){const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>{m.map?.dispose();m.dispose();});}});
    };
  }, []);
  return canvasRef;
}

function makeSaturnTexture() {
  const c=document.createElement('canvas'); c.width=1024;c.height=512;const ctx=c.getContext('2d');
  const g=ctx.createLinearGradient(0,0,0,512);
  g.addColorStop(0,'#e8d4a5');g.addColorStop(.2,'#d4c090');g.addColorStop(.4,'#f0e0c0');g.addColorStop(.5,'#e8d4a5');g.addColorStop(.6,'#f0e0c0');g.addColorStop(.8,'#d4c090');g.addColorStop(1,'#e8d4a5');
  ctx.fillStyle=g;ctx.fillRect(0,0,1024,512);
  for(let i=0;i<50;i++){const y=Math.random()*512,h=Math.random()*20+5;ctx.fillStyle=`rgba(139,119,101,${Math.random()*.3})`;ctx.fillRect(0,y,1024,h);}
  return new THREE.CanvasTexture(c);
}
function makeRingTexture(){const c=document.createElement('canvas');c.width=512;c.height=512;const ctx=c.getContext('2d');const g=ctx.createRadialGradient(256,256,100,256,256,256);g.addColorStop(0,'rgba(220,210,180,0)');g.addColorStop(.3,'rgba(220,210,180,.7)');g.addColorStop(.5,'rgba(230,220,190,.9)');g.addColorStop(.7,'rgba(220,210,180,.6)');g.addColorStop(1,'rgba(220,210,180,0)');ctx.fillStyle=g;ctx.fillRect(0,0,512,512);return new THREE.CanvasTexture(c);}
function makeStarField(count,radiusSpread,size,opacity,color){const p=new Float32Array(count*3);for(let i=0;i<count;i++){p[i*3]=(Math.random()-.5)*radiusSpread;p[i*3+1]=(Math.random()-.5)*(radiusSpread*.85);p[i*3+2]=-Math.random()*radiusSpread;}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));return new THREE.Points(g,new THREE.PointsMaterial({color,size,transparent:true,opacity,depthWrite:false}));}
