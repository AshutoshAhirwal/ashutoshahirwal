import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const bgCanvasRef = useRef(null);
  const orbCanvasRef = useRef(null);
  const orbWrapRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // ── BG CANVAS ──
    const el = document.getElementById('s2'), bgCv = bgCanvasRef.current;
    if (!el || !bgCv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 700;
    
    const bgR = new THREE.WebGLRenderer({ canvas: bgCv, antialias: true, alpha: false });
    bgR.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bgR.setSize(W, H);
    bgR.setClearColor(0x07070a, 1);

    const bgScene = new THREE.Scene(), bgCam = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    bgCam.position.z = 10;
    const starP = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      starP[i * 3] = (Math.random() - 0.5) * 30;
      starP[i * 3 + 1] = (Math.random() - 0.5) * 22;
      starP[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const sg2 = new THREE.BufferGeometry(); sg2.setAttribute('position', new THREE.BufferAttribute(starP, 3));
    bgScene.add(new THREE.Points(sg2, new THREE.PointsMaterial({ color: 0x00adee, size: 0.05, transparent: true, opacity: 0.18 })));
    bgScene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // ── ORB CANVAS ──
    const orbWrap = orbWrapRef.current;
    const orbCv = orbCanvasRef.current;
    const OW = orbWrap.offsetWidth;
    const OH = 380;
    orbCv.width = OW * Math.min(window.devicePixelRatio, 2);
    orbCv.height = OH * Math.min(window.devicePixelRatio, 2);
    orbCv.style.width = OW + 'px';
    orbCv.style.height = OH + 'px';
    
    const orbR = new THREE.WebGLRenderer({ canvas: orbCv, antialias: true, alpha: true });
    orbR.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    orbR.setSize(OW, OH);
    orbR.setClearColor(0, 0);

    const orbScene = new THREE.Scene(), orbCam = new THREE.PerspectiveCamera(60, OW / OH, 0.1, 100);
    orbCam.position.z = 7;

    const skillData = [
      { name: 'Drupal', pct: 97, c: 0x00adee, r: 0.72 },
      { name: 'Twig', pct: 95, c: 0x33c9f7, r: 0.62 },
      { name: 'SDC', pct: 92, c: 0x00adee, r: 0.58 },
      { name: 'SCSS', pct: 93, c: 0xa78bfa, r: 0.60 },
      { name: 'Storybook', pct: 88, c: 0xa78bfa, r: 0.54 },
      { name: 'JavaScript', pct: 90, c: 0xfbbf24, r: 0.56 },
      { name: 'Tailwind', pct: 85, c: 0x4ade80, r: 0.50 },
      { name: 'Layout Builder', pct: 90, c: 0x00adee, r: 0.55 },
    ];

    const orbs = [];
    const cols = 4;
    skillData.forEach((sd, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * 2.0 + (Math.random() - 0.5) * 0.3;
      const y = (row - 0.5) * 1.9 + (Math.random() - 0.5) * 0.2;
      const grp = new THREE.Group();
      const solid = new THREE.Mesh(new THREE.SphereGeometry(sd.r, 28, 28), new THREE.MeshStandardMaterial({ color: sd.c, transparent: true, opacity: 0.8 }));
      const wire = new THREE.Mesh(new THREE.SphereGeometry(sd.r + 0.05, 28, 28), new THREE.MeshStandardMaterial({ color: sd.c, wireframe: true, transparent: true, opacity: 0.25 }));
      grp.add(solid); grp.add(wire);
      grp.position.set(x, y, 0);
      grp.userData = { ox: x, oy: y, sp: 0.0025 + Math.random() * 0.004, ph: Math.random() * Math.PI * 2, name: sd.name, pct: sd.pct, solid };
      orbScene.add(grp); orbs.push(grp);
    });

    const connLines = [];
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const dx = orbs[i].position.x - orbs[j].position.x;
        const dy = orbs[i].position.y - orbs[j].position.y;
        if (Math.sqrt(dx * dx + dy * dy) < 3.2) {
          const pts = [orbs[i].position.clone(), orbs[j].position.clone()];
          const lg = new THREE.BufferGeometry().setFromPoints(pts);
          const lm = new THREE.LineBasicMaterial({ color: 0x00adee, transparent: true, opacity: 0.15 });
          const line = new THREE.Line(lg, lm);
          orbScene.add(line);
          connLines.push({ line, i, j, mat: lm });
        }
      }
    }

    orbScene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pl1 = new THREE.PointLight(0x00adee, 3, 22); pl1.position.set(0, 5, 7); orbScene.add(pl1);
    const pl2 = new THREE.PointLight(0xa78bfa, 2, 20); pl2.position.set(5, -3, 6); orbScene.add(pl2);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9, -9);
    let hoveredOrb = null;
    const tooltip = tooltipRef.current;

    const onMouseMove = (e) => {
      const rect = orbCv.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / OW) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / OH) * 2 + 1;
      if (tooltip) {
        tooltip.style.left = (e.clientX - rect.left) + 'px';
        tooltip.style.top = (e.clientY - rect.top) + 'px';
      }
    };
    const onMouseLeave = () => { mouse.set(-9, -9); if (tooltip) tooltip.style.display = 'none'; };

    orbCv.addEventListener('mousemove', onMouseMove);
    orbCv.addEventListener('mouseleave', onMouseLeave);

    let t = 0;
    let frameId = null;
    let isVis = true;
    const obs = new IntersectionObserver(e => isVis = e[0].isIntersecting, {threshold: 0});
    if (typeof el !== 'undefined' && el) obs.observe(el);
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      if (!isVis) return;
      t += 0.007;

      orbs.forEach(g => {
        g.position.y = g.userData.oy + Math.sin(t + g.userData.ph) * g.userData.sp * 55;
        g.position.x = g.userData.ox + Math.cos(t * 0.65 + g.userData.ph) * g.userData.sp * 28;
        g.rotation.x += 0.005; g.rotation.y += 0.008;
      });

      connLines.forEach(({ line, i, j }) => {
        const pa = orbs[i].position, pb = orbs[j].position;
        const pts = [pa.clone(), pb.clone()];
        line.geometry.setFromPoints(pts);
        line.geometry.attributes.position.needsUpdate = true;
      });

      raycaster.setFromCamera(mouse, orbCam);
      const meshes = [];
      orbs.forEach(g => g.children.forEach(c => { if (!c.material.wireframe) meshes.push(c) }));
      const hits = raycaster.intersectObjects(meshes);
      hoveredOrb = null;
      if (hits.length) {
        const hm = hits[0].object;
        orbs.forEach(g => { if (g.children.includes(hm)) hoveredOrb = g });
      }
      orbs.forEach(g => {
        const h = g === hoveredOrb;
        const ts = h ? 1.3 : 1;
        g.scale.lerp(new THREE.Vector3(ts, ts, ts), 0.12);
        g.children.forEach(c => { if (!c.material.wireframe) c.material.opacity = h ? 0.98 : 0.8 });
      });

      if (tooltip) {
        if (hoveredOrb) {
          tooltip.style.display = 'block';
          tooltip.innerHTML = `<b style="color:#00adee">${hoveredOrb.userData.name}</b> &nbsp;${hoveredOrb.userData.pct}%`;
        } else {
          tooltip.style.display = 'none';
        }
      }

      orbR.render(orbScene, orbCam);
      bgR.render(bgScene, bgCam);
    };
    loop();

    const handleResize = () => {
      const newW = el.offsetWidth;
      const newH = el.offsetHeight || 700;
      if (newW > 0 && newH > 0) {
        bgR.setSize(newW, newH);
        bgCam.aspect = newW / newH;
        bgCam.updateProjectionMatrix();
        
        const newOW = orbWrap.offsetWidth;
        if (newOW > 0) {
          orbR.setSize(newOW, OH);
          orbCam.aspect = newOW / OH;
          orbCam.updateProjectionMatrix();
        }
      }
    };
    window.addEventListener('resize', handleResize);

    /* ── SKILL BARS FILL ── */
    const bars = document.querySelectorAll('.sr-fi');
    const barsTrigger = ScrollTrigger.create({
      trigger: '#skill-rows',
      start: 'top 85%',
      onEnter: () => {
        bars.forEach(b => {
          gsap.to(b, {
            scaleX: b.dataset.w,
            duration: 1.5,
            ease: 'power4.out',
            delay: 0.2
          });
        });
      }
    });

    return () => {
      if (typeof obs !== 'undefined') obs.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
      orbCv.removeEventListener('mousemove', onMouseMove);
      orbCv.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', handleResize);
      barsTrigger.kill();
      bgR.dispose();
      orbR.dispose();
      sg2.dispose();
      orbs.forEach(g => {
        g.children.forEach(c => {
          c.geometry?.dispose();
          c.material?.dispose();
        });
      });
      connLines.forEach(c => {
        c.line.geometry?.dispose();
        c.line.material?.dispose();
      });
    };
  }, []);

  return (
    <section className="ps" id="s2">
      <canvas className="sc" ref={bgCanvasRef}></canvas>
      <div className="si">
        <div className="slbl" style={{ gridColumn: '1/-1' }}>// Chapter 02 — The Arsenal</div>
        <h2 className="stit" style={{ fontSize: 'clamp(30px, 5vw, 54px)', gridColumn: '1/-1', marginBottom: '0px' }}>Skills that <span style={{ color: 'var(--acc)' }}>ship products.</span></h2>
        <p style={{ gridColumn: '1/-1', fontSize: '18px', color: 'var(--mt)', marginBottom: '32px' }}>The strongest layer is Drupal frontend architecture:</p>
        <div className="skills-box">
          <div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--mt)', marginBottom: '12px', letterSpacing: '.1em' }}>HOVER THE ORBS — EACH ONE IS A SKILL ↓</p>
            <div id="orb-wrap" ref={orbWrapRef}>
              <canvas id="orb-canvas" ref={orbCanvasRef} style={{ width: '100%', height: '380px', display: 'block' }}></canvas>
              <div id="orb-tooltip" ref={tooltipRef} style={{ position: 'absolute', background: 'rgba(10,10,16,.95)', border: '1px solid rgba(0,173,238,.35)', padding: '8px 14px', borderRadius: '4px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--tx)', pointerEvents: 'none', display: 'none', zIndex: 20, transform: 'translateY(-110%)', whiteSpace: 'nowrap' }}></div>
            </div>
          </div>
          <div>
            <div className="skill-rows" id="skill-rows">
              <div className="sr"><div className="sr-top"><span className="sr-nm">Drupal 8/9/10/11</span><span className="sr-pc">97%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".97" style={{ background: 'var(--acc)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">Twig Templating</span><span className="sr-pc">95%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".95" style={{ background: 'var(--acc)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">SDC / Layout Builder</span><span className="sr-pc">92%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".92" style={{ background: 'var(--acc)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">SCSS / SASS / CSS3</span><span className="sr-pc">93%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".93" style={{ background: 'var(--acc2)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">Storybook / Pattern Lab</span><span className="sr-pc">88%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".88" style={{ background: 'var(--acc2)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">HTML5 / JavaScript</span><span className="sr-pc">90%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".90" style={{ background: 'var(--acc2)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">Tailwind CSS</span><span className="sr-pc">85%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".85" style={{ background: 'var(--grn)' }}></div></div></div>
              <div className="sr"><div className="sr-top"><span className="sr-nm">Git / Composer / Drush</span><span className="sr-pc">88%</span></div><div className="sr-tr"><div className="sr-fi" data-w=".88" style={{ background: 'var(--grn)' }}></div></div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '20px' }}>
              <div style={{ padding: '12px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '4px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--acc)' }}>105+</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--mt)', marginTop: '2px' }}>Credits</div></div>
              <div style={{ padding: '12px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '4px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--acc2)' }}>15+</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--mt)', marginTop: '2px' }}>Projects</div></div>
              <div style={{ padding: '12px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '4px', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--grn)' }}>2</div><div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: 'var(--mt)', marginTop: '2px' }}>Blogs</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
