import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('s0'), cv = canvasRef.current;
    if (!el || !cv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 700;
    
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0, 0);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 300);
    cam.position.set(0, 0, 22);

    /* Drupal drop shape as particle cloud — right side */
    const dropPts = [];
    for (let lat = 0; lat < Math.PI * 0.9; lat += 0.07) {
      const baseR = 4.5 + Math.sin(lat * 1.2) * 1.8;
      const stretch = 0.45 + lat / Math.PI * 0.2;
      const yOff = lat * 3.2 - 7;
      const count = Math.max(4, Math.floor(baseR * 8));
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        dropPts.push(
          Math.cos(a) * baseR + (Math.random() - 0.5) * 0.3,
          yOff + (Math.random() - 0.5) * 0.25,
          Math.sin(a) * baseR * stretch + (Math.random() - 0.5) * 0.3
        );
      }
    }
    /* drip tip */
    for (let y = 0; y < 3.5; y += 0.18) {
      const r = Math.max(0.08, 0.5 * (1 - y / 3.5));
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        dropPts.push(Math.cos(a) * r, y + 9.4, Math.sin(a) * r * 0.45);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dropPts), 3));
    const drop = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0x00adee, size: 0.09, transparent: true, opacity: 0.65 }));
    drop.position.set(9, -0.5, 0);
    scene.add(drop);

    /* interconnected constellation lines for hero */
    const connPts = [];
    for (let i = 0; i < 60; i++) {
      connPts.push((Math.random() - 0.5) * 34, (Math.random() - 0.5) * 24, (Math.random() - 0.5) * 15);
    }
    const linePairs = [];
    for (let i = 0; i < connPts.length / 3; i++) {
      for (let j = i + 1; j < connPts.length / 3; j++) {
        const dx = connPts[i * 3] - connPts[j * 3], dy = connPts[i * 3 + 1] - connPts[j * 3 + 1], dz = connPts[i * 3 + 2] - connPts[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 7) { linePairs.push(connPts[i * 3], connPts[i * 3 + 1], connPts[i * 3 + 2], connPts[j * 3], connPts[j * 3 + 1], connPts[j * 3 + 2]) }
      }
    }
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePairs), 3));
    scene.add(new THREE.LineSegments(lGeo, new THREE.LineBasicMaterial({ color: 0x00adee, transparent: true, opacity: 0.08 })));

    const starP = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      starP[i * 3] = (Math.random() - 0.5) * 70;
      starP[i * 3 + 1] = (Math.random() - 0.5) * 55;
      starP[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(starP, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.2 })));

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl = new THREE.PointLight(0x00adee, 3, 70);
    pl.position.set(12, 6, 12);
    scene.add(pl);
    const pl2 = new THREE.PointLight(0xa78bfa, 1.5, 50);
    pl2.position.set(-10, -5, 8);
    scene.add(pl2);

    let mx = 0, my = 0;
    const onMouseMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', onMouseMove);

    const heroTxt = document.querySelector('#s0 .si');
    const heroStats = document.querySelector('.hero-stats');

    let t = 0;
    let frameId = null;
    const loop = () => {
      frameId = requestAnimationFrame(loop);
      t += 0.006;
      drop.rotation.y = t * 0.35 + mx * 0.12;
      drop.rotation.x = my * 0.08 + Math.sin(t * 0.3) * 0.04;
      cam.position.x += (mx * 2.5 - cam.position.x) * 0.03;
      cam.position.y += (my * 1.5 - cam.position.y) * 0.03;
      cam.lookAt(0, 0, 0);
      if (heroTxt) { heroTxt.style.transform = `translate(${mx * 5}px, ${window.scrollY * 0.18}px)` }
      if (heroStats) { heroStats.style.transform = `translate(${mx * -3}px, 0)` }
      renderer.render(scene, cam);
    };
    loop();

    const handleResize = () => {
      const newW = el.offsetWidth;
      const newH = el.offsetHeight || 700;
      if (newW > 0 && newH > 0) {
        renderer.setSize(newW, newH);
        cam.aspect = newW / newH;
        cam.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    /* ── STAT COUNTERS ── */
    const statsTrigger = ScrollTrigger.create({
      trigger: '.hero-stats',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const stats = [
          { value: 5, target: document.querySelectorAll('.hs-n')[0] },
          { value: 105, target: document.querySelectorAll('.hs-n')[1] }
        ];
        stats.forEach(s => {
          if (!s.target) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: s.value,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => { s.target.textContent = Math.round(obj.val) + '+'; }
          });
        });
      }
    });

    /* ── MAGNETIC BUTTONS ── */
    const btns = document.querySelectorAll('.hero-ctas .bp, .hero-ctas .bgo');
    const btnListeners = [];
    btns.forEach(btn => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.3;
        const y = (e.clientY - r.top - r.height / 2) * 0.3;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      };
      const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      btnListeners.push({ btn, onMove, onLeave });
    });

    /* ── HERO REVEAL ── */
    let ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 1 });
      heroTl.from('.badge', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
      
      const heroLines = document.querySelectorAll('#s0 .stit span span');
      heroLines.forEach((inner) => {
        heroTl.from(inner, { y: '110%', opacity: 0, duration: 0.75, ease: 'power4.out' }, `-=0.5`);
      });
      
      heroTl.from('#s0 .sdesc', { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      heroTl.from('.hero-ctas .bp, .hero-ctas .bgo', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.3');
      heroTl.from('.hero-stats', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    });

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      statsTrigger.kill();
      ctx.revert();
      btnListeners.forEach(l => {
        l.btn.removeEventListener('mousemove', l.onMove);
        l.btn.removeEventListener('mouseleave', l.onLeave);
      });
      renderer.dispose();
      geo.dispose();
      lGeo.dispose();
      sg.dispose();
    };
  }, []);

  const scrollToWork = () => document.getElementById('s3').scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="ps" id="s0" style={{ paddingTop: '62px' }}>
      <canvas className="sc" ref={canvasRef}></canvas>
      <div className="si">
        <div>
          <div className="badge"><span className="bdot"></span>Senior Drupal Dev · Open to work · Indore, India</div>
          <h1 className="stit" style={{ fontSize: 'clamp(52px, 9vw, 108px)', marginBottom: '20px' }}>
            <span style={{ color: 'var(--tx)', display: 'block', overflow: 'hidden' }}>
              <span className="hero-word" style={{ display: 'block' }}>Ashutosh</span>
            </span>
            <span style={{ color: 'var(--acc)', display: 'block', overflow: 'hidden' }}>
              <span className="hero-word" style={{ display: 'block' }}>Ahirwal</span>
            </span>
            <span style={{ color: 'var(--acc2)', display: 'block', fontSize: '.6em', overflow: 'hidden' }} id="tw-hero">
              <span className="hero-word" style={{ display: 'block' }}>Drupal Geek.<span className="tw-cursor"></span></span>
            </span>
          </h1>
          <p className="sdesc" style={{ maxWidth: '460px' }}><b>Senior Drupal Frontend Developer</b> with 5+ years of expertise in Drupal 8/9/10/11. Specialized in Twig, SDC, Layout Builder, Storybook. <b>105+ Drupal.org credits</b>. Module maintainer. Community contributor.</p>
          <div className="hero-ctas">
            <button className="bp" onClick={scrollToWork}>Explore My Work</button>
            <button className="bgo" onClick={() => window.open('https://www.linkedin.com/in/ashutosh-ahirwal-546859184/', '_blank')}>LinkedIn →</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="hs">
            <div className="hs-bar" style={{ background: 'linear-gradient(to bottom, #00adee, #0078a8)' }}></div>
            <div className="hs-n" style={{ color: '#00adee' }}>5+</div>
            <div className="hs-l">Years Drupal</div>
          </div>
          <div className="hs">
            <div className="hs-bar" style={{ background: 'linear-gradient(to bottom, #a78bfa, #7c3aed)' }}></div>
            <div className="hs-n" style={{ color: '#a78bfa' }}>105+</div>
            <div className="hs-l">Drupal.org Credits</div>
          </div>
          <div className="hs">
            <div className="hs-bar" style={{ background: 'linear-gradient(to bottom, #4ade80, #16a34a)' }}></div>
            <div className="hs-n" style={{ color: '#4ade80', fontSize: '20px' }}>D8→D11</div>
            <div className="hs-l">All Drupal versions</div>
          </div>
          <div className="hs">
            <div className="hs-bar" style={{ background: 'linear-gradient(to bottom, #fbbf24, #d97706)' }}></div>
            <div className="hs-n" style={{ color: '#fbbf24', fontSize: '17px' }}>Specbee</div>
            <div className="hs-l">Senior Dev · 3 yrs</div>
          </div>
        </div>
      </div>
      <div className="scue"><div className="sline"></div><span>SCROLL</span></div>
    </section>
  );
};

export default Hero;
