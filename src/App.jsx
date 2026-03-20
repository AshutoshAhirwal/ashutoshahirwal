import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import SideTracker from './components/SideTracker';
import Narrator from './components/Narrator';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [isVisualMode, setIsVisualMode] = useState(false);

  useEffect(() => {
    if (isVisualMode) {
      document.body.classList.add('visual-mode');
    } else {
      document.body.classList.remove('visual-mode');
    }
  }, [isVisualMode]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      /* ── PAGE LOAD SEQUENCE ── */
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from('nav', { y: -80, opacity: 0, duration: 0.7, ease: 'power3.out' });
      tl.from('.badge', { scale: 0.6, opacity: 0, duration: 0.5, ease: 'back.out(2)' }, '-=0.3');

      tl.from('.hero-word', { y: '110%', opacity: 0, duration: 0.75, stagger: 0.15, ease: 'power4.out' }, `-=0.5`);

      tl.from('#s0 .sdesc', { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }, '-=0.3');
      tl.from('.hero-ctas .bp, .hero-ctas .bgo', { opacity: 0, y: 16, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, '-=0.3');
      tl.from('.hs', { opacity: 0, x: 40, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.5');
      tl.from('#track', { opacity: 0, x: -20, duration: 0.5, ease: 'power2.out' }, '-=0.3');
      tl.from('#nd', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2.5)' }, '-=0.2');
      tl.from('.scue', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, '-=0.3');

      /* ── S1 ABOUT ── */
      ScrollTrigger.create({
        trigger: '#s1', start: 'top 75%', once: true,
        onEnter: () => {
          gsap.from('#s1 .slbl', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
          gsap.from('#s1 .stit', { opacity: 0, y: 50, duration: 0.8, ease: 'power4.out', delay: 0.1 });
          gsap.from('#s1 .sdesc', { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out', delay: 0.3 });
          gsap.from('#s1 .pill', { opacity: 0, scale: 0.7, duration: 0.4, stagger: 0.05, ease: 'back.out(1.8)', delay: 0.5 });
          gsap.from('.fun-card', { opacity: 0, y: 25, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.6 });
          gsap.from('.about-card', { opacity: 0, x: 50, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
        }
      });

      /* ── S2 SKILLS ── */
      ScrollTrigger.create({
        trigger: '#s2', start: 'top 75%', once: true,
        onEnter: () => {
          gsap.from('#s2 .slbl', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
          gsap.from('#s2 .stit', { opacity: 0, y: 40, duration: 0.8, ease: 'power4.out', delay: 0.1 });
          gsap.from('#orb-wrap', { opacity: 0, scale: 0.85, duration: 1, ease: 'power3.out', delay: 0.2 });
          gsap.from('.sr', { opacity: 0, x: 40, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
          gsap.from('#s2 [style*="text-align: center"]', { opacity: 0, scale: 0.6, duration: 0.5, stagger: 0.1, ease: 'back.out(2)', delay: 0.7 });
        }
      });

      /* ── S3 PROJECTS ── */
      ScrollTrigger.create({
        trigger: '#s3', start: 'top 80%', once: true,
        onEnter: () => {
          gsap.from('#s3 .slbl', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
          gsap.from('#s3 .stit', { opacity: 0, y: 40, duration: 0.8, ease: 'power4.out', delay: 0.1 });
          gsap.from('.pc', { opacity: 0, y: 60, scale: 0.92, duration: 0.65, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
          gsap.from('#s3 p', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out', delay: 0.9 });
        }
      });

      /* ── S4 BLOG ── */
      ScrollTrigger.create({
        trigger: '#s4', start: 'top 75%', once: true,
        onEnter: () => {
          gsap.from('#s4 .slbl', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
          gsap.from('#s4 .stit', { opacity: 0, y: 40, duration: 0.8, ease: 'power4.out', delay: 0.1 });
          gsap.from('#s4 .sdesc', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 0.25 });
          gsap.from('#s4 .drupal-credits-box', { opacity: 0, x: -40, duration: 0.7, ease: 'power3.out', delay: 0.4 });
          gsap.from('.blog-card', { opacity: 0, y: 40, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 0.2 });
        }
      });

      /* ── S5 SERVICES ── */
      ScrollTrigger.create({
        trigger: '#s5', start: 'top 80%', once: true,
        onEnter: () => {
          gsap.from('#s5 .slbl', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
          gsap.from('#s5 .stit', { opacity: 0, y: 40, duration: 0.8, ease: 'power4.out', delay: 0.1 });
          gsap.from('.svc-tile', { opacity: 0, y: 35, scale: 0.96, duration: 0.55, stagger: 0.07, ease: 'power3.out', delay: 0.2 });
        }
      });

      /* ── S6 CONTACT ── */
      ScrollTrigger.create({
        trigger: '#s6', start: 'top 75%', once: true,
        onEnter: () => {
          gsap.from('#s6 .slbl', { opacity: 0, x: -30, duration: 0.6, ease: 'power3.out' });
          gsap.from('#s6 .stit', { opacity: 0, y: 50, duration: 0.9, ease: 'power4.out', delay: 0.1 });
          gsap.from('#s6 .sdesc', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out', delay: 0.3 });
          gsap.from('.ci-link', { opacity: 0, x: -24, duration: 0.5, stagger: 0.09, ease: 'power3.out', delay: 0.4 });
          gsap.from('.cf-field', { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 });
          gsap.from('#s6 .bp', { opacity: 0, y: 16, scale: 0.95, duration: 0.5, ease: 'back.out(2)', delay: 0.75 });
        }
      });

      /* ── SECTION TITLE HIGHLIGHT UNDERLINES ── */
      const highlights = document.querySelectorAll('.stit span[style*="color:var(--acc)"]');
      highlights.forEach(span => {
        span.style.position = 'relative';
        span.style.display = 'inline-block';
        const underline = document.createElement('span');
        underline.style.cssText = 'position:absolute;bottom:2px;left:0;width:0;height:3px;background:#00adee;border-radius:2px;display:block';
        span.appendChild(underline);
        ScrollTrigger.create({
          trigger: span, start: 'top 80%', once: true,
          onEnter: () => { gsap.to(underline, { width: '100%', duration: 0.7, delay: 0.5, ease: 'power3.out' }); }
        });
      });

      /* ── PARALLAX ── */
      document.querySelectorAll('.slbl').forEach(el => {
        gsap.to(el, { x: 15, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 } });
      });

      document.querySelectorAll('.about-card').forEach((el, i) => {
        gsap.to(el, { y: -12 * (i % 2 === 0 ? 1 : -1), ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 2 } });
      });
      
      /* ── PROGRESS BAR ── */
      const progressBar = document.createElement('div');
      progressBar.id = 'progress-bar-element';
      progressBar.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:linear-gradient(to right,#00adee,#a78bfa);z-index:9999;width:0%;pointer-events:none;transition:none';
      document.body.appendChild(progressBar);
      ScrollTrigger.create({
        start: 'top top', end: 'bottom bottom', scrub: 0,
        onUpdate: self => { if(document.getElementById('progress-bar-element')) document.getElementById('progress-bar-element').style.width = (self.progress * 100) + '%'; }
      });
      
      /* ── FLOATING DOTS ── */
      const floatingDots = [];
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'floating-dot-bg';
        const size = 3 + Math.random() * 5;
        dot.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:50%;background:#00adee;opacity:0;pointer-events:none;z-index:1`;
        document.body.appendChild(dot);
        gsap.set(dot, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
        gsap.to(dot, {
          opacity: 0.12 + Math.random() * 0.1,
          x: `+=${(Math.random() - 0.5) * 200}`,
          y: `+=${(Math.random() - 0.5) * 200}`,
          duration: 6 + Math.random() * 6,
          repeat: -1, yoyo: true, ease: 'sine.inOut', delay: Math.random() * 4
        });
        floatingDots.push(dot);
      }
    });

    return () => {
      ctx.revert();
      const pBar = document.getElementById('progress-bar-element');
      if (pBar) pBar.remove();
      document.querySelectorAll('.floating-dot-bg').forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="portfolio-app">
      <CustomCursor />
      <Navbar />
      <SideTracker />
      <Narrator />
      
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Projects />
        <Blog />
        <Services />
        <Contact />
      </main>

      <Footer />
      
      {/* VIEW: VISUAL TOGGLE */}
      <button id="vv-btn" onClick={() => setIsVisualMode(!isVisualMode)} aria-label="Toggle light/dark mode">
        <span id="vv-icon" style={{ fontSize: '13px', lineHeight: 1 }}>{isVisualMode ? '☀️' : '🌙'}</span>
        <span id="vv-label">{isVisualMode ? 'VIEW: DARK' : 'VIEW: LIGHT'}</span>
      </button>
    </div>
  );
};

export default App;
