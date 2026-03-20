import React, { useEffect } from 'react';

const CustomCursor = () => {
  useEffect(() => {
    const cur = document.getElementById('cursor');
    const curR = document.getElementById('cursor-ring');
    let cx = 0, cy = 0, rx = 0, ry = 0;

    const moveCursor = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (cur) {
        cur.style.left = cx + 'px';
        cur.style.top = cy + 'px';
      }
    };

    const animateCursor = () => {
      requestAnimationFrame(animateCursor);
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      if (curR) {
        curR.style.left = rx + 'px';
        curR.style.top = ry + 'px';
      }
    };

    document.addEventListener('mousemove', moveCursor);
    animateCursor();

    const handleHover = () => {
      if (cur) {
        cur.style.width = '20px';
        cur.style.height = '20px';
        cur.style.opacity = '0.7';
      }
    };

    const handleLeave = () => {
      if (cur) {
        cur.style.width = '12px';
        cur.style.height = '12px';
        cur.style.opacity = '1';
      }
    };

    const interactiveElements = document.querySelectorAll('button, a, .pc, .pill, .about-card, .blog-card, .fun-card, .tk-dot, #nd');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div id="cursor"></div>
      <div id="cursor-ring"></div>
    </>
  );
};

export default CustomCursor;
