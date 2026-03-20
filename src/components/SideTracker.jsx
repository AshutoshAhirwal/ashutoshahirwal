import React, { useEffect, useState } from 'react';

const SideTracker = () => {
  const [active, setActive] = useState(0);
  const sections = ['Hero', 'About', 'Skills', 'Work', 'Blog', 'Services', 'Contact'];

  useEffect(() => {
    const handleScroll = () => {
      const psSections = document.querySelectorAll('.ps');
      let currentActive = 0;
      psSections.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.55) {
          currentActive = i;
        }
      });
      setActive(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const gotoS = (i) => {
    const section = document.getElementById(`s${i}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="track">
      {sections.map((label, i) => (
        <React.Fragment key={i}>
          <div 
            className={`tk-dot ${active === i ? 'on' : ''}`} 
            onClick={() => gotoS(i)}
          >
            <div className="tk-tip">{label}</div>
          </div>
          {i < sections.length - 1 && (
            <div className={`tk-line ${active > i ? 'on' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SideTracker;
