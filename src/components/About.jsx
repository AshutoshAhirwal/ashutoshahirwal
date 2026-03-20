import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const About = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('s1'), cv = canvasRef.current;
    if (!el || !cv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 800;
    
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x07070a, 1);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    cam.position.set(0, 6, 14);
    cam.lookAt(0, 0, 0);

    const wGeo = new THREE.PlaneGeometry(30, 20, 80, 45);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x00adee, wireframe: true, transparent: true, opacity: 0.1 });
    const wave = new THREE.Mesh(wGeo, wMat);
    wave.rotation.x = -Math.PI / 3;
    scene.add(wave);

    /* floating nodes on the wave */
    const nodePositions = [[-3, 1, 0], [3, 1.5, 0], [-5, -1, 0], [5, -0.5, 0], [0, 2, 0], [-1, -2, 0]];
    const nodes = [];
    nodePositions.forEach(p => {
      const nm = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshStandardMaterial({ color: 0x00adee, transparent: true, opacity: 0.8 }));
      nm.position.set(p[0], p[1], p[2]);
      scene.add(nm);
      nodes.push(nm);
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pl = new THREE.PointLight(0x00adee, 4, 55);
    pl.position.set(0, 9, 11);
    scene.add(pl);

    const pos = wGeo.attributes.position;
    const oy = [];
    for (let i = 0; i < pos.count; i++) oy.push(pos.getY(i));

    let t = 0;
    let frameId = null;
    let isVis = true;
    const obs = new IntersectionObserver(e => isVis = e[0].isIntersecting, {threshold: 0});
    if (typeof el !== 'undefined' && el) obs.observe(el);
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      if (!isVis) return;
      t += 0.009;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        pos.setY(i, oy[i] + Math.sin(x * 0.4 + t) * 0.55 + Math.cos(z * 0.35 + t * 0.8) * 0.45);
      }
      pos.needsUpdate = true;
      nodes.forEach((n, i) => {
        n.position.y = nodePositions[i][1] + Math.sin(t + i * 0.8) * 0.3;
      });
      renderer.render(scene, cam);
    };
    loop();

    const handleResize = () => {
      const newW = el.offsetWidth;
      const newH = el.offsetHeight || 800;
      if (newW > 0 && newH > 0) {
        renderer.setSize(newW, newH);
        cam.aspect = newW / newH;
        cam.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    /* ── FUN CARDS HOVER WOBBLE ── */
    const funCards = document.querySelectorAll('.fun-card');
    const funListeners = [];
    funCards.forEach(card => {
      const onEnter = () => {
        gsap.to(card, { scale: 1.04, rotation: (Math.random() - 0.5) * 3, duration: 0.3, ease: 'back.out(2)' });
        gsap.to(card.querySelector('.fun-icon'), { scale: 1.4, duration: 0.3, ease: 'back.out(2)' });
      };
      const onLeave = () => {
        gsap.to(card, { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1,0.5)' });
        gsap.to(card.querySelector('.fun-icon'), { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      funListeners.push({ card, onEnter, onLeave });
    });

    /* ── PILL HOVER POP ── */
    const pills = document.querySelectorAll('.pill');
    const pillListeners = [];
    pills.forEach(pill => {
      const onEnter = () => gsap.to(pill, { scale: 1.1, duration: 0.2, ease: 'back.out(2)' });
      const onLeave = () => gsap.to(pill, { scale: 1, duration: 0.2, ease: 'power2.out' });
      pill.addEventListener('mouseenter', onEnter);
      pill.addEventListener('mouseleave', onLeave);
      pillListeners.push({ pill, onEnter, onLeave });
    });

    /* ── ABOUT CARD HOVER ── */
    const aboutCards = document.querySelectorAll('.about-card');
    const aboutListeners = [];
    aboutCards.forEach(card => {
      const onEnter = () => gsap.to(card, { borderColor: 'rgba(0,173,238,0.4)', scale: 1.02, duration: 0.3, ease: 'power2.out' });
      const onLeave = () => gsap.to(card, { borderColor: 'rgba(255,255,255,0.07)', scale: 1, duration: 0.3, ease: 'power2.out' });
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      aboutListeners.push({ card, onEnter, onLeave });
    });

    return () => {
      if (typeof obs !== 'undefined') obs.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      funListeners.forEach(l => {
        l.card.removeEventListener('mouseenter', l.onEnter);
        l.card.removeEventListener('mouseleave', l.onLeave);
      });
      pillListeners.forEach(l => {
        l.pill.removeEventListener('mouseenter', l.onEnter);
        l.pill.removeEventListener('mouseleave', l.onLeave);
      });
      aboutListeners.forEach(l => {
        l.card.removeEventListener('mouseenter', l.onEnter);
        l.card.removeEventListener('mouseleave', l.onLeave);
      });
      renderer.dispose();
      wGeo.dispose();
      wMat.dispose();
      nodes.forEach(n => {
        n.geometry?.dispose();
        n.material?.dispose();
      });
    };
  }, []);

  return (
    <section className="ps" id="s1">
      <canvas className="sc" ref={canvasRef}></canvas>
      <div className="si">
        <div>
          <div className="slbl">// Chapter 01 — The Human</div>
          <h2 className="stit" style={{ fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: '18px' }}>From Indore,<br /><span style={{ color: 'var(--acc)' }}>with code.</span></h2>
          <p className="sdesc"><b>I'm a Drupal frontend developer</b> who loves building scalable, accessible, high-performance interfaces. Started in 2016 with a Diploma in CS, B.E. in 2022, and never stopped shipping.<br /><br />I've worked at <b>Smashing Infolabs</b>, then <b>Specbee</b> (3 years as Senior Dev), now at <b>Dotsquares</b> building SDC-first Drupal experiences.<br /><br />I also write technical blogs on Specbee and contribute patches to Drupal core.</p>
          <div className="pills" style={{ marginTop: '18px' }}>
            <span className="pill hi">Drupal 8/9/10/11</span><span className="pill hi">SDC</span><span className="pill hi">Twig</span>
            <span className="pill hi">Layout Builder</span><span className="pill">Storybook</span><span className="pill">Pattern Lab</span>
            <span className="pill">SCSS/SASS</span><span className="pill">Tailwind</span><span className="pill">PHP</span>
            <span className="pill">Composer/Drush</span><span className="pill">Git/GitHub</span><span className="pill">Pantheon</span>
          </div>
          <div className="fun-grid">
            <div className="fun-card"><div className="fun-icon">🏍️</div>Dreams of riding to<br /><b style={{ color: 'var(--tx)' }}>Leh-Ladakh</b> one day</div>
            <div className="fun-card"><div className="fun-icon">🧀</div>Believes there is no<br /><b style={{ color: 'var(--tx)' }}>"too much cheese"</b></div>
            <div className="fun-card"><div className="fun-icon">🦉</div>Proud <b style={{ color: 'var(--tx)' }}>night owl</b> —<br />best code after midnight</div>
            <div className="fun-card"><div className="fun-icon">✈️</div><b style={{ color: 'var(--tx)' }}>Foodie & traveller</b> —<br />exploring one city at a time</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="slbl" style={{ marginBottom: '4px' }}>// Experience</div>
          <div className="about-card">
            <div className="ac-year" style={{ color: 'var(--acc)' }}>Sep 2025 — Present</div>
            <div className="ac-role">Programmer Analyst</div>
            <div className="ac-co">Dotsquares India · Jaipur, Rajasthan</div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--mt)', marginTop: '8px', lineHeight: '1.6' }}>SDC, Layout Builder, Storybook, Pattern Lab — Drupal 9/10 custom theming & component dev.</p>
          </div>
          <div className="about-card">
            <div className="ac-year" style={{ color: 'var(--acc2)' }}>Sep 2022 — Sep 2025</div>
            <div className="ac-role">Senior Drupal Frontend Developer</div>
            <div className="ac-co">Specbee Consulting Pvt Ltd · Bangalore</div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--mt)', marginTop: '8px', lineHeight: '1.6' }}>Enterprise Drupal projects. SDC, Storybook, Pattern Lab. Published 2 technical blogs. 105+ community credits.</p>
          </div>
          <div className="about-card">
            <div className="ac-year" style={{ color: 'var(--grn)' }}>Jan 2021 — Sep 2022</div>
            <div className="ac-role">Drupal Developer</div>
            <div className="ac-co">Smashing Infolabs Pvt Ltd · Indore</div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--mt)', marginTop: '8px', lineHeight: '1.6' }}>Theme development, backend module building, content architecture.</p>
          </div>
          <div className="about-card" style={{ borderColor: 'rgba(251,191,36,.15)' }}>
            <div className="ac-year" style={{ color: 'var(--warn)' }}>Education</div>
            <div className="ac-role">B.E. Computer Science & Engineering</div>
            <div className="ac-co">Chameli Devi Group of Institutions · 2019–2022</div>
            <div className="ac-role" style={{ marginTop: '10px', fontSize: '13px' }}>Diploma in Computer Science</div>
            <div className="ac-co">Shri Vaishnav Polytechnic · 2016–2019</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
