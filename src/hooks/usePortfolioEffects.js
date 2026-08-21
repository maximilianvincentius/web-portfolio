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

const GALAXY_CONFIG = {
  // Binary tokens rendered on particles
  binaryTokens: ['0', '1'],
  
  // Particle counts & size
  countDesktop: 15000,
  countMobile: 10000,
  particleSizeDesktop: 0.16,
  particleSizeMobile: 0.10,

  // Galaxy Shape Math (Matched to Bode's Galaxy M81)
  arms: 2,                  // M81 has 2 major prominent spiral arms
  radius: 29,               // Disk radius
  spin: -1.8,               // Arm winding curve
  randomness: 0.45,         // Scatter dispersion off the spine
  power: 1.8,               // Center concentration factor
  
  // Angle & Elliptical Tilt
  tiltAngleX: Math.PI * 0.35, 
  tiltAngleZ: -Math.PI * 0.12, 
  ellipseStretchY: 0.7,    // Squashes circular plane into an elliptical disk

  // M81 Color Palette
  coreColor: '#fff4d6',     // Warm golden white central bulge
  midColor: '#3a7bd5',      // Deep cosmic blue spiral disc
  armHighlights: '#f857a6', // Pink/Magenta active starburst clusters
  outerColor: '#121936',    // Dark navy outer halo

  // Selective Outer Animation
  rotationSpeed: 0.0015,    // Speed for outer particles
  staticCoreRadius: 0.30,   // Central core ratio (0% - 30% of radius stays still)
};

export function useThreeScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    camera.position.set(0, 0, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));

    const galaxyGroup = new THREE.Group();
    galaxyGroup.rotation.x = GALAXY_CONFIG.tiltAngleX;
    galaxyGroup.rotation.z = GALAXY_CONFIG.tiltAngleZ;
    scene.add(galaxyGroup);


    const createCrispBinaryTexture = (text) => {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 128;
      texCanvas.height = 128;
      const ctx = texCanvas.getContext('2d');
      
      ctx.font = '700 44px "Courier New", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 64, 64);
      
      const texture = new THREE.CanvasTexture(texCanvas);
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      return texture;
    };

    const textures = GALAXY_CONFIG.binaryTokens.map(text => createCrispBinaryTexture(text));

    const totalParticles = mobile ? GALAXY_CONFIG.countMobile : GALAXY_CONFIG.countDesktop;
    const countPerTexture = Math.floor(totalParticles / textures.length);

    const colorCore = new THREE.Color(GALAXY_CONFIG.coreColor);
    const colorMid = new THREE.Color(GALAXY_CONFIG.midColor);
    const colorHighlight = new THREE.Color(GALAXY_CONFIG.armHighlights);
    const colorOuter = new THREE.Color(GALAXY_CONFIG.outerColor);

    textures.forEach((texture) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(countPerTexture * 3);
      const colors = new Float32Array(countPerTexture * 3);
      const spinSpeeds = new Float32Array(countPerTexture);

      for (let i = 0; i < countPerTexture; i++) {
        const r = Math.pow(Math.random(), GALAXY_CONFIG.power) * GALAXY_CONFIG.radius;
        
        // 2-Arm Spiral Math
        const armIndex = i % GALAXY_CONFIG.arms;
        const phi = (armIndex * 2 * Math.PI) / GALAXY_CONFIG.arms;
        const spinAngle = r * GALAXY_CONFIG.spin;

        // Dispersion & Scatter
        const spread = GALAXY_CONFIG.randomness * (r * 0.35 + 0.2);
        const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * spread;
        const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * spread * 0.3;
        const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * spread;

        // Apply Elliptical squashing along Y axis
        const rawX = Math.cos(phi + spinAngle) * r + randomX;
        const rawY = (Math.sin(phi + spinAngle) * r + randomZ) * GALAXY_CONFIG.ellipseStretchY;

        positions[i * 3] = rawX;
        positions[i * 3 + 1] = rawY;
        positions[i * 3 + 2] = randomY; 

        const coreThreshold = GALAXY_CONFIG.radius * GALAXY_CONFIG.staticCoreRadius;
        if (r > coreThreshold) {
          spinSpeeds[i] = ((r - coreThreshold) / (GALAXY_CONFIG.radius - coreThreshold)) * GALAXY_CONFIG.rotationSpeed;
        } else {
          spinSpeeds[i] = 0;
        }

        // Color blending for M81 palette
        const mixedColor = colorCore.clone();
        
        if (r < GALAXY_CONFIG.radius * 0.2) {
          mixedColor.lerp(colorCore, r / (GALAXY_CONFIG.radius * 0.2));
        } else if (r < GALAXY_CONFIG.radius * 0.65) {
          const isHighlight = Math.random() < 0.18;
          mixedColor.lerp(isHighlight ? colorHighlight : colorMid, (r - GALAXY_CONFIG.radius * 0.2) / (GALAXY_CONFIG.radius * 0.45));
        } else {
          mixedColor.lerp(colorOuter, (r - GALAXY_CONFIG.radius * 0.65) / (GALAXY_CONFIG.radius * 0.35));
        }

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('spinSpeed', new THREE.BufferAttribute(spinSpeeds, 1));

      const material = new THREE.PointsMaterial({
        size: mobile ? GALAXY_CONFIG.particleSizeMobile : GALAXY_CONFIG.particleSizeDesktop,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        map: texture,
        transparent: true,
        alphaTest: 0.08,
        opacity: 0.85
      });

      galaxyGroup.add(new THREE.Points(geometry, material));
    });

    const pointer = { x: 0, y: 0 };
    const onMove = e => {
      pointer.x = ((e.clientX / window.innerWidth) - 0.5) * (mobile ? 0.2 : 0.4);
      pointer.y = ((e.clientY / window.innerHeight) - 0.5) * (mobile ? 0.1 : 0.2);
    };
    window.addEventListener('mousemove', onMove);

    const reset = () => {
      galaxyGroup.position.set(0, 0, 0);
    };
    const finalPose = () => {
      galaxyGroup.position.set(0, -2, 0);
      galaxyGroup.scale.set(0.6, 0.6, 0.6);
    };
    reset();

    const master = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: 'body',
        start: mobile ? 'top+=40 top' : 'top top',
        end: 'bottom bottom',
        scrub: mobile ? 0.45 : 1.5,
        invalidateOnRefresh: !mobile,
        fastScrollEnd: !mobile,
        onUpdate: self => { if (mobile && self.progress >= 0.985) finalPose(); },
        onLeave: () => mobile && finalPose(),
        onLeaveBack: () => mobile && reset(),
      }
    });

    master.to(galaxyGroup.position, { x: -2, y: 1, z: 0, duration: 1 }, 0);
    master.to(galaxyGroup.position, { x: 1.5, y: -0.5, z: 0, duration: 1 }, 1);
    master.to(galaxyGroup.position, { x: 0, y: -2, z: 0, duration: 1 }, 2);
    master.to(galaxyGroup.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 1 }, 2);

    // ==========================================
    // 4. ANIMATION LOOP (OUTER PARTICLE ROTATION)
    // ==========================================
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);

      // Rotate individual outer particles along their spiral orbit
      galaxyGroup.children.forEach((points) => {
        const positions = points.geometry.attributes.position.array;
        const spinSpeeds = points.geometry.attributes.spinSpeed.array;

        for (let i = 0; i < spinSpeeds.length; i++) {
          const speed = spinSpeeds[i];
          if (speed === 0) continue; // Skip static core particles

          const idx = i * 3;
          const x = positions[idx];
          const y = positions[idx + 1];

          // Orbital rotation matrix around galaxy plane
          const cos = Math.cos(speed);
          const sin = Math.sin(speed);

          positions[idx] = x * cos - y * sin;
          positions[idx + 1] = x * sin + y * cos;
        }

        points.geometry.attributes.position.needsUpdate = true;
      });

      // Mouse Parallax
      camera.position.x += (pointer.x * 3 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Full viewport canvas resize handler
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.matchMedia('(max-width:768px)').matches ? 1.5 : 2));
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      master.scrollTrigger?.kill();
      master.kill();
      renderer.dispose();
      textures.forEach(t => t.dispose());
      galaxyGroup.children.forEach(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
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
