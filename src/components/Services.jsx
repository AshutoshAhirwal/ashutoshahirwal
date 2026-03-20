import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const Services = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('s5'), cv = canvasRef.current;
    if (!el || !cv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 500;
    
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x07070a, 1);

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    cam.position.z = 10;
    
    const n = 400; const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
        p[i * 3] = (Math.random() - 0.5) * 28;
        p[i * 3 + 1] = (Math.random() - 0.5) * 20;
        p[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x00adee, size: 0.05, transparent: true, opacity: 0.15 })));
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    let t = 0;
    let frameId = null;
    const loop = () => {
        frameId = requestAnimationFrame(loop);
        t += 0.003;
        scene.rotation.y = t;
        renderer.render(scene, cam);
    };
    loop();

    const handleResize = () => {
      const newW = el.offsetWidth;
      const newH = el.offsetHeight || 500;
      if (newW > 0 && newH > 0) {
        renderer.setSize(newW, newH);
        cam.aspect = newW / newH;
        cam.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    /* ── SERVICE TILE HOVER ── */
    const tiles = document.querySelectorAll('.svc-tile');
    const tileListeners = [];
    tiles.forEach(tile => {
      const onEnter = () => {
        gsap.to(tile.querySelector('.svc-ic'), { scale: 1.3, rotation: 10, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(tile.querySelector('.svc-nm'), { x: 4, duration: 0.25, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(tile.querySelector('.svc-ic'), { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        gsap.to(tile.querySelector('.svc-nm'), { x: 0, duration: 0.25, ease: 'power2.out' });
      };
      tile.addEventListener('mouseenter', onEnter);
      tile.addEventListener('mouseleave', onLeave);
      tileListeners.push({ tile, onEnter, onLeave });
    });

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      tileListeners.forEach(l => {
        l.tile.removeEventListener('mouseenter', l.onEnter);
        l.tile.removeEventListener('mouseleave', l.onLeave);
      });
      renderer.dispose();
      g.dispose();
    };
  }, []);

  const services = [
    { ic: '⬡', nm: 'Drupal Theming & SDC', desc: 'Expert Twig templating, SDC component development, Layout Builder customization for D9/D10/D11.' },
    { ic: '◈', nm: 'Storybook / Pattern Lab', desc: 'Component-driven development with full Storybook or Pattern Lab documentation. Scalable design systems.' },
    { ic: '◉', nm: 'Performance & SEO', desc: 'Accessibility compliance, SEO techniques, responsive images, Core Web Vitals optimization for Drupal.' },
    { ic: '⟳', nm: 'Drupal Site Building', desc: 'Views, Paragraphs, Taxonomy, Webform, Media, Configuration Management. D8 through D11.' },
    { ic: '▦', nm: 'Tailwind / SCSS Theming', desc: 'Modern CSS with Tailwind, SCSS, SASS, LESS. Gulp task runners, Bootstrap, Flexbox, Grid.' },
    { ic: '⟁', nm: 'Mentoring & Code Review', desc: 'Team mentoring, junior dev support, AI-assisted code review, proactive team collaboration.' },
  ];

  return (
    <section className="ps" id="s5" style={{ minHeight: 'auto' }}>
      <canvas className="sc" ref={canvasRef}></canvas>
      <div className="si" style={{ padding: '80px 52px', maxWidth: '100%' }}>
        <div className="slbl">// Chapter 05 — What I Offer</div>
        <h2 className="stit" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>Services that <span style={{ color: 'var(--acc)' }}>deliver.</span></h2>
        <div className="svc-grid">
          {services.map((s, i) => (
            <div key={i} className="svc-tile">
              <div className="svc-ic">{s.ic}</div>
              <div className="svc-nm">{s.nm}</div>
              <div className="svc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
