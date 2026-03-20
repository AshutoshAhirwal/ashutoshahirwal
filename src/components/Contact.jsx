import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Contact = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const el = document.getElementById('s6'), cv = canvasRef.current;
    if (!el || !cv) return;
    const W = el.offsetWidth, H = el.offsetHeight || 700;
    
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x07070a, 1);

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    cam.position.z = 14;

    const n = 1400; const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 * 12, r = 1.5 + i / n * 10;
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
        pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x00adee, size: 0.06, transparent: true, opacity: 0.55 })));
    
    let t = 0;
    let frameId = null;
    let isVis = true;
    const obs = new IntersectionObserver(e => isVis = e[0].isIntersecting, {threshold: 0});
    if (typeof el !== 'undefined' && el) obs.observe(el);
    const loop = () => {
        frameId = requestAnimationFrame(loop);
      if (!isVis) return;
        t += 0.004;
        scene.rotation.y = t;
        scene.rotation.x = Math.sin(t * 0.2) * 0.1;
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

    return () => {
      if (typeof obs !== 'undefined') obs.disconnect();
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      g.dispose();
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button');
    const originalText = btn.innerHTML;
    
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/ashutosh15798@gmail.com', {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        alert('Message sent! Ashutosh will get back to you within 24 hours.');
        form.reset();
      } else {
        alert('Failed to send message. Please try emailing directly.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending message. Please try emailing directly.');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  };

  return (
    <section className="ps" id="s6">
      <canvas className="sc" ref={canvasRef}></canvas>
      <div className="si">
        <div>
          <div className="slbl">// Chapter 06 — Let's Build</div>
          <h2 className="stit" style={{ fontSize: 'clamp(32px, 5vw, 62px)' }}>Got a Drupal<br />project <span style={{ color: 'var(--acc)' }}>in mind?</span></h2>
          <p className="sdesc" style={{ marginTop: '14px' }}>Open to <b>freelance, contract, and full-time</b> Drupal opportunities. Drupal theming, SDC, Storybook, migrations — let's talk.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '28px' }}>
            <a className="ci-link" href="mailto:ashutosh15798@gmail.com">
              <div className="ci-icon">✉</div>
              <div><div className="ci-label">Email</div><div className="ci-val">ashutosh15798@gmail.com</div></div>
            </a>
            <a className="ci-link" href="tel:+919340301969">
              <div className="ci-icon">📞</div>
              <div><div className="ci-label">Phone</div><div className="ci-val">+91 93403 01969</div></div>
            </a>
            <a className="ci-link" href="https://www.linkedin.com/in/ashutosh-ahirwal-546859184/" target="_blank" rel="noreferrer">
              <div className="ci-icon" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--acc)', fontFamily: 'DM Mono, monospace' }}>in</div>
              <div><div className="ci-label">LinkedIn</div><div className="ci-val">ashutosh-ahirwal-546859184</div></div>
            </a>
            <a className="ci-link" href="https://www.drupal.org/u/ashutosh-ahirwal" target="_blank" rel="noreferrer">
              <div className="ci-icon" style={{ fontSize: '11px', fontWeight: '700', color: 'var(--acc)', fontFamily: 'DM Mono, monospace' }}>D.</div>
              <div><div className="ci-label">Drupal.org</div><div className="ci-val">105+ community credits</div></div>
            </a>
            <div className="ci-link" style={{ cursor: 'default', borderStyle: 'dashed', opacity: 0.7 }}>
              <div className="ci-icon">📍</div>
              <div><div className="ci-label">Location</div><div className="ci-val">Jaipur, Rajasthan · Remote-friendly ⚡</div></div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSendMessage} style={{ width: '100%' }}>
          <input type="hidden" name="_subject" value="New message from portfolio!" />
          <div className="cf-field">
            <label className="cf-label">Your Name</label>
            <input className="cf-input" type="text" name="name" placeholder="e.g. Rahul Sharma" required />
          </div>
          <div className="cf-field">
            <label className="cf-label">Email Address</label>
            <input className="cf-input" type="email" name="email" placeholder="your@email.com" required />
          </div>
          <div className="cf-field">
            <label className="cf-label">Project Type</label>
            <input className="cf-input" type="text" name="_subject_custom" placeholder="Drupal theming / SDC / migration..." required />
          </div>
          <div className="cf-field">
            <label className="cf-label">Message</label>
            <textarea className="cf-input" name="message" placeholder="Tell me about your project, timeline, and budget..." required></textarea>
          </div>
          <button type="submit" className="bp" style={{ marginTop: '4px', width: '100%', padding: '15px', fontSize: '13px', letterSpacing: '.06em', borderRadius: '6px' }}>Send Message →</button>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--mt)', marginTop: '10px', textAlign: 'center' }}>⚡ Usually responds within 24 hours</p>
        </form>
      </div>
    </section>
  );
};

export default Contact;
