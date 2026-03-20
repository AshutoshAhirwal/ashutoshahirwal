import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const pcfg = [
  { bg: 0x090612, c: 0x00adee, shape: 'drop' },
  { bg: 0x06080f, c: 0xa78bfa, shape: 'knot' },
  { bg: 0x060d08, c: 0x4ade80, shape: 'oct' },
  { bg: 0x0d0a04, c: 0xfbbf24, shape: 'torus' },
  { bg: 0x0d0606, c: 0xff6b6b, shape: 'ico' },
  { bg: 0x08060d, c: 0x38bdf8, shape: 'box' },
];

const ProjectCard = ({ index, tag, title, tech }) => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const cv = canvasRef.current;
    if (!wrap || !cv) return;

    let renderer, scene, cam, main, frameId;

    const init = () => {
      const W = wrap.offsetWidth, H = wrap.offsetHeight || 280;
      const cfg = pcfg[index % pcfg.length];
      
      renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(cfg.bg, 1);

      scene = new THREE.Scene();
      cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
      cam.position.z = 5;

      if (cfg.shape === 'drop') {
        const pts = [];
        for (let lat = 0; lat < Math.PI * 0.85; lat += 0.12) {
          const r = 1.2 + Math.sin(lat * 1.2) * 0.5;
          for (let i = 0; i < Math.floor(r * 10); i++) {
            const a = (i / Math.floor(r * 10)) * Math.PI * 2;
            pts.push(Math.cos(a) * r, lat * 2.2 - 1.5, Math.sin(a) * r * 0.45);
          }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
        main = new THREE.Points(g, new THREE.PointsMaterial({ color: cfg.c, size: 0.09, transparent: true, opacity: 0.85 }));
      } else if (cfg.shape === 'knot') {
        main = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.3, 80, 10, 2, 3), new THREE.MeshStandardMaterial({ color: cfg.c, wireframe: true, transparent: true, opacity: 0.6 }));
      } else if (cfg.shape === 'oct') {
        main = new THREE.Mesh(new THREE.OctahedronGeometry(1.5), new THREE.MeshStandardMaterial({ color: cfg.c, wireframe: true, transparent: true, opacity: 0.6 }));
      } else if (cfg.shape === 'torus') {
        main = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.4, 14, 60), new THREE.MeshStandardMaterial({ color: cfg.c, wireframe: true, transparent: true, opacity: 0.55 }));
      } else if (cfg.shape === 'ico') {
        main = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), new THREE.MeshStandardMaterial({ color: cfg.c, wireframe: true, transparent: true, opacity: 0.55 }));
      } else {
        main = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshStandardMaterial({ color: cfg.c, wireframe: true, transparent: true, opacity: 0.6 }));
      }
      
      scene.add(main);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const pl = new THREE.PointLight(cfg.c, 3, 20); pl.position.set(3, 3, 4); scene.add(pl);
      loop();
    };

    let spinning = false;
    const onEnter = () => spinning = true;
    const onLeave = () => spinning = false;
    wrap.addEventListener('mouseenter', onEnter);
    wrap.addEventListener('mouseleave', onLeave);

    const loop = () => {
      frameId = requestAnimationFrame(loop);
      const sp = spinning ? 0.03 : 0.011;
      main.rotation.x += sp * 0.7;
      main.rotation.y += sp;
      renderer.render(scene, cam);
    };

    const cleanup = () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
      if (main) {
        if (main.geometry) main.geometry.dispose();
        if (main.material) main.material.dispose();
      }
    };

    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !renderer) {
        init();
      } else if (!entries[0].isIntersecting && renderer) {
        cleanup();
        renderer = null;
      }
    }, { threshold: 0.01 });
    obs.observe(wrap);

    const handleResize = () => {
      if (!renderer) return;
      const newW = wrap.offsetWidth, newH = wrap.offsetHeight || 280;
      renderer.setSize(newW, newH);
      cam.aspect = newW / newH;
      cam.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      obs.disconnect();
      cleanup();
      wrap.removeEventListener('mouseenter', onEnter);
      wrap.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [index]);

  return (
    <div className={`pc ${index === 0 ? 'featured' : ''}`} ref={wrapRef}>
      <canvas ref={canvasRef}></canvas>
      <div className="pc-num">{String(index + 1).padStart(2, '0')}</div>
      <div className="pc-body">
        <div className="pc-tag">{tag}</div>
        <div className="pc-title">{title}</div>
        <div className="pc-tech">{tech}</div>
      </div>
    </div>
  );
};

const Projects = () => {
  const bgCanvasRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('s3'), cv = bgCanvasRef.current;
    if (!el || !cv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 600;
    
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x07070a, 1);

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    cam.position.z = 11;

    const dGeo = new THREE.TorusKnotGeometry(5, 1.2, 160, 16, 2, 3);
    const dMesh = new THREE.Mesh(dGeo, new THREE.MeshStandardMaterial({ color: 0x00adee, wireframe: true, transparent: true, opacity: 0.06 }));
    scene.add(dMesh);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pl = new THREE.PointLight(0x00adee, 2, 50); pl.position.set(8, 6, 8); scene.add(pl);

    let t = 0;
    let frameId = null;
    let isVis = true;
    const obs = new IntersectionObserver(e => isVis = e[0].isIntersecting, {threshold: 0});
    if (typeof el !== 'undefined' && el) obs.observe(el);
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      if (!isVis) return;
      t += 0.004;
      dMesh.rotation.y = t * 0.3;
      dMesh.rotation.x = t * 0.18;
      renderer.render(scene, cam);
    };
    loop();

    const handleResize = () => {
      const newW = el.offsetWidth;
      const newH = el.offsetHeight || 600;
      if (newW > 0 && newH > 0) {
        renderer.setSize(newW, newH);
        cam.aspect = newW / newH;
        cam.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (typeof obs !== 'undefined') obs.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      dGeo.dispose();
      dMesh.material.dispose();
    };
  }, []);

  const projects = [
    { tag: 'Drupal 9 · SDC · Featured', title: 'Apollo Hospitals', tech: 'Drupal 9, SDC, Twig, Layout Builder, SASS — Enterprise healthcare portal' },
    { tag: 'Drupal 9 · Tailwind', title: 'Nerivio', tech: 'Drupal 9, Tailwind CSS, Layout Builder' },
    { tag: 'Drupal 9 · Custom', title: 'Zayed University', tech: 'Custom theming, JSON data sharing for Frontend' },
    { tag: 'Drupal 8 · SDC', title: 'SEMI', tech: 'Drupal 8, Paragraph, View, SDC — Multilingual' },
    { tag: 'Drupal 8 · Elastic', title: 'Great Southern Homes', tech: 'Drupal 8, Elastic Search, Custom Theme' },
    { tag: 'Drupal 8 · Full Redesign', title: 'First Industrial', tech: 'Custom theming from scratch — internal site' },
  ];

  return (
    <section className="ps" id="s3" style={{ minHeight: 'auto', padding: 0 }}>
      <canvas className="sc" ref={bgCanvasRef}></canvas>
      <div className="si" style={{ padding: '100px 52px 80px', maxWidth: '100%' }}>
        <div className="slbl">// Chapter 03 — Real Work, Real Clients</div>
        <h2 className="stit" style={{ fontSize: 'clamp(30px, 5vw, 54px)', marginBottom: '36px' }}>Built & <span style={{ color: 'var(--acc)' }}>shipped.</span></h2>
        <div className="proj-grid">
          {projects.map((p, i) => (
            <ProjectCard key={i} index={i} {...p} />
          ))}
        </div>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--mt)', marginTop: '16px', textAlign: 'center' }}>+ BMO Global Asset Management · Hologic · Ubicquia · EDB · Barbeque Nation · Heritage Foundation · and more</p>
      </div>
    </section>
  );
};

export default Projects;
