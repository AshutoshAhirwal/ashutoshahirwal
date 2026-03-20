import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

const narratorScripts = [
  { lines: ["Hey! I'm the <b>Drupal drop</b> 👋", "I'm here to guide you through<br><b>Ashutosh's</b> world!", "Click me anytime for<br>more about him 😊"] },
  { lines: ["Ashutosh started with<br><b>Drupal in 2016</b> 💙", "He's a night owl who dreams<br>of riding to <b>Leh-Ladakh</b> 🏍️", "And yes — there is NO<br>such thing as <b>too much cheese</b> 🧀"] },
  { lines: ["<b>Hover the glowing orbs</b><br>to explore his skills!", "Each orb = a skill.<br>Bigger = more expertise.", "<b>Drupal is the biggest</b><br>for a good reason 😄"] },
  { lines: ["These are <b>real clients</b><br>Ashutosh has worked with!", "Apollo Hospitals, Nerivio,<br><b>SEMI, Great Southern Homes</b>...", "Hover each card to<br>see the tech stack 🚀"] },
  { lines: ["Ashutosh doesn't just build —<br>he <b>writes & contributes</b> too!", "<b>105+ Drupal.org credits</b><br>and counting...", "Two published blogs on<br><b>Specbee</b> — click to read!"] },
  { lines: ["Need a Drupal dev?<br><b>Ashutosh is open to work!</b>", "Drupal 8 to 11,<br>SDC, Twig, Storybook, all of it.", "Check out his services<br>and reach out below!"] },
  { lines: ["You've reached the end!<br>Impressed? <b>Let's connect!</b> 🎉", "Drop a message below —<br>usually replies in <b>24 hours</b> ⚡", "Thanks for exploring<br>Ashutosh's world! 🙏"] }
];

const Narrator = () => {
  const [curSec, setCurSec] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.ps');
      let active = 0;
      sections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.55) {
          active = i;
        }
      });
      if (active !== curSec) {
        setCurSec(active);
        setLineIdx(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(() => setShow(true), 1000);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [curSec]);

  const cycleNarrator = () => {
    setLineIdx((prev) => (prev + 1) % narratorScripts[curSec].lines.length);
    gsap.fromTo('#nd',
      { scale: 1.2, filter: 'drop-shadow(0 0 20px rgba(0,173,238,1))' },
      { scale: 1, filter: 'drop-shadow(0 0 6px rgba(0,173,238,.4))', duration: 0.6, ease: 'elastic.out(1,0.4)' }
    );
  };

  return (
    <div id="narrator">
      <div id="nb" className={show ? 'show' : ''}>
        <span dangerouslySetInnerHTML={{ __html: narratorScripts[curSec]?.lines[lineIdx] }} />
        <span className="nb-tip">Click drop for next →</span>
      </div>
      <svg id="nd" viewBox="0 0 80 100" onClick={cycleNarrator} style={{ pointerEvents: 'all' }}>
        <defs>
          <radialGradient id="dg" cx="38%" cy="30%">
            <stop offset="0%" stopColor="#33c9f7" />
            <stop offset="100%" stopColor="#0078a8" />
          </radialGradient>
        </defs>
        <path d="M40 2C40 2 8 34 8 56C8 76 22.5 94 40 94C57.5 94 72 76 72 56C72 34 40 2 40 2Z" fill="url(#dg)" />
        <ellipse cx="30" cy="54" rx="10" ry="11" fill="white" opacity=".95" />
        <ellipse cx="30" cy="54" rx="5" ry="5.5" fill="#0078a8" />
        <ellipse cx="31" cy="52" rx="2.2" ry="2.5" fill="white" />
        <ellipse cx="52" cy="60" rx="7" ry="8" fill="white" opacity=".6" />
        <path d="M33 76C33 76 40 82 47 76" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".85" />
        <ellipse cx="34" cy="17" rx="5" ry="8" fill="white" opacity=".12" transform="rotate(-22 34 17)" />
      </svg>
    </div>
  );
};

export default Narrator;
