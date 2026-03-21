import React, { useEffect } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    // Toggle body scroll
    if (isOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isOpen]);

  useEffect(() => {
    // Nav link hover underline slide
    const links = document.querySelectorAll('.nav-links a, .nav-mobile-overlay a');
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
    if (btn) {
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
    }
  }, []);

  const scrollToContact = () => {
    setIsOpen(false);
    document.getElementById('s6').scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'About', href: '#s1' },
    { label: 'Skills', href: '#s2' },
    { label: 'Work', href: '#s3' },
    { label: 'Blog', href: '#s4' },
    { label: 'Contact', href: '#s6' },
  ];

  return (
    <>
      <nav>
        <a className="nav-logo" href="#">
          <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 22L8 4L14 22M4 16H12" stroke="var(--acc)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22L18 4L24 22M14 16H22" stroke="var(--acc2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
          </svg>
          ashutosh.dev
        </a>
        
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.label}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="nav-cta" onClick={scrollToContact}>Let's Talk →</button>
          <div className={`nav-mobile-btn ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div className={`nav-mobile-overlay ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link, i) => (
          <a 
            key={link.label} 
            href={link.href} 
            onClick={() => setIsOpen(false)}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            {link.label}
          </a>
        ))}
        <button className="bp" style={{ marginTop: '20px' }} onClick={scrollToContact}>Let's Talk</button>
      </div>
    </>
  );
};

export default Navbar;
