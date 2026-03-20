import React, { useEffect } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  useEffect(() => {
    // Nav link hover underline slide
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
      link.style.position = 'relative';
      const line = document.createElement('span');
      line.style.cssText = 'position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#00adee;transition:none';
      link.appendChild(line);
      
      const onEnter = () => {
        gsap.to(line, { width: '100%', duration: 0.25, ease: 'power2.out' });
        gsap.to(link, { color: '#f0eef8', duration: 0.2 });
      };
      
      const onLeave = () => {
        gsap.to(line, { width: '0%', duration: 0.2, ease: 'power2.in' });
        gsap.to(link, { color: '', duration: 0.2 });
      };

      link.addEventListener('mouseenter', onEnter);
      link.addEventListener('mouseleave', onLeave);
    });

    // CTA Button magnetic effect
    const btn = document.querySelector('.nav-cta');
    const onMouseMove = (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
    };
    const onMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' });
    };
    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const scrollToContact = () => {
    document.getElementById('s6').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav>
      <a className="nav-logo" href="#">
        <svg width="18" height="24" viewBox="0 0 56 76">
          <path d="M28 0C28 0 5 22 5 44C5 57.8 15.3 69 28 69C40.7 69 51 57.8 51 44C51 22 28 0 28 0Z" fill="#00adee" />
          <circle cx="21" cy="43" r="7" fill="white" opacity=".9" />
          <circle cx="21" cy="43" r="3.5" fill="#00adee" />
          <circle cx="22.5" cy="41" r="1.5" fill="white" />
        </svg>
        ashutosh.dev
      </a>
      <ul className="nav-links">
        <li><a href="#s1">About</a></li>
        <li><a href="#s2">Skills</a></li>
        <li><a href="#s3">Work</a></li>
        <li><a href="#s4">Blog</a></li>
        <li><a href="#s6">Contact</a></li>
      </ul>
      <button className="nav-cta" onClick={scrollToContact}>Let's Talk →</button>
    </nav>
  );
};

export default Navbar;
