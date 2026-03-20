import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const Blog = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('s4'), cv = canvasRef.current;
    if (!el || !cv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 600;
    
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x07070a, 1);

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    cam.position.set(0, 4, 13); cam.lookAt(0, 0, 0);

    const geo = new THREE.PlaneGeometry(26, 16, 60, 35);
    const mat = new THREE.MeshStandardMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.09 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 3.2;
    scene.add(mesh);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl = new THREE.PointLight(0xa78bfa, 3, 50);
    pl.position.set(0, 8, 10);
    scene.add(pl);

    const pos = geo.attributes.position;
    const oy = [];
    for (let i = 0; i < pos.count; i++) oy.push(pos.getY(i));

    let t = 0;
    let frameId = null;
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      t += 0.009;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        pos.setY(i, oy[i] + Math.sin(x * 0.4 + t) * 0.5 + Math.cos(z * 0.35 + t * 0.8) * 0.4);
      }
      pos.needsUpdate = true;
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

    const ctx = gsap.context(() => {
      /* ── BLOG CARD TILT ── */
      const blogCards = document.querySelectorAll('.blog-card');
      blogCards.forEach(card => {
        const onMove = e => {
          const r = card.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
          const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
          gsap.to(card, { rotationY: x, rotationX: y, duration: 0.3, ease: 'power2.out', transformPerspective: 600 });
        };
        const onLeave = () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
    };
  }, []);

  return (
    <section className="ps" id="s4">
      <canvas className="sc" ref={canvasRef}></canvas>
      <div className="si">
        <div>
          <div className="slbl">// Chapter 04 — The Writer</div>
          <h2 className="stit" style={{ fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '18px' }}>Sharing what<br /><span style={{ color: 'var(--acc)' }}>I learn.</span></h2>
          <p className="sdesc">I write technical articles on Drupal development, published on <b>Specbee's blog</b>. Community contributions matter — I put my learnings back into the ecosystem.</p>
          <div className="drupal-credits-box" style={{ marginTop: '24px', padding: '20px 24px', background: 'rgba(12,12,18,.8)', border: '1px solid rgba(0,173,238,.2)', borderRadius: '6px' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--acc)', letterSpacing: '.12em', marginBottom: '8px' }}>DRUPAL.ORG CONTRIBUTIONS</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--tx)' }}>105+ Credits</div>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--mt)', marginTop: '4px' }}>Core patches · Module maintenance · Community sprints</div>
            <a href="https://www.drupal.org/u/ashutosh-ahirwal" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--acc)', marginTop: '12px', textDecoration: 'none' }}>View Drupal Profile →</a>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <a className="blog-card" href="https://www.specbee.com/blogs/writing-smarter-drupal-code-starts-with-package-json" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="bc-date">18 March, 2025 · Specbee Blog</div>
            <div className="bc-title">Writing Smarter Drupal Code Starts with package.json</div>
            <div className="bc-desc">package.json is not just a dependency tracker — it's a powerful tool for efficiency, automation, and scalability in Node.js and Drupal projects.</div>
            <span className="bc-link">Read on Specbee →</span>
          </a>
          <a className="blog-card" href="https://www.specbee.com/blogs/starterkit-theme-in-drupal-10" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="bc-date">06 December, 2022 · Specbee Blog</div>
            <div className="bc-title">Starterkit Theme in Drupal 10: A Better Starting Point for Your Theme</div>
            <div className="bc-desc">An in-depth guide to Drupal 10's Starterkit theme system — implementing a modern, scalable starting point for custom Drupal theming.</div>
            <span className="bc-link">Read on Specbee →</span>
          </a>
          <div style={{ padding: '16px 20px', background: 'var(--card)', border: '1px solid var(--brd)', borderRadius: '4px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--mt)' }}>
            Also a <b style={{ color: 'var(--tx)' }}>maintainer of contributed modules/themes</b> on Drupal.org. Submitted core patches during community sprints.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
