(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introTitle = document.getElementById('intro-title');
  const underline = document.getElementById('intro-underline');
  const enterBtn = document.getElementById('enter-cta');
  const intro = document.getElementById('intro-landing');
  const main = document.getElementById('main');
  const logo = document.getElementById('logo');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Typing animation
  function typeText(el, text, delay=40){
    if(prefersReduced){ el.textContent = text; underline.style.width = '100%'; return Promise.resolve(); }
    el.textContent = '';
    return new Promise(res=>{
      let i=0; const step = ()=>{
        if(i<text.length){ el.textContent += text[i++]; setTimeout(step, delay); }
        else res();
      }; step();
    });
  }

  function drawUnderline(){ return new Promise(res=>{ underline.style.transition = 'width 350ms ease-out'; underline.style.width = '58%'; setTimeout(res,380); }); }
  function glitch(){ return new Promise(res=>{ if(prefersReduced){res();return;} intro.classList.add('glitch'); setTimeout(()=>{ intro.classList.remove('glitch'); res(); },260); }); }

  async function runIntro(){
    await typeText(introTitle, "Rishikesh’s Portfolio", 40);
    await drawUnderline();
    await glitch();
    // auto transition after 1s
    setTimeout(()=>{ morphToHero(); }, 1000);
  }

  function morphToHero(){
    // simple morph: hide intro, reveal main
    intro.style.transition = 'opacity 600ms ease-out, transform 600ms ease-out';
    intro.style.opacity = 0; intro.style.transform='scale(0.98) translateY(-10px)';
    setTimeout(()=>{ intro.style.display='none'; window.scrollTo({top:0}); document.documentElement.style.scrollBehavior='smooth'; },650);
  }

  // Enter button
  enterBtn.addEventListener('click', ()=>{ morphToHero(); });

  // Run intro
  if(!prefersReduced){ runIntro(); } else { underline.style.width='58%'; }

  // Theme toggle
  function setTheme(dark){ if(dark){ document.documentElement.classList.add('dark'); themeToggle.textContent='☀'; localStorage.theme='dark'; } else { document.documentElement.classList.remove('dark'); themeToggle.textContent='🌙'; localStorage.theme='light'; } }
  const saved = localStorage.getItem('theme'); if(saved==='dark') setTheme(true);
  themeToggle.addEventListener('click', ()=>{ const dark = document.documentElement.classList.toggle('dark'); setTheme(dark); });

  // Smooth scroll for nav
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href'); if(href.length>1){ e.preventDefault(); const target = document.querySelector(href); if(target) target.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  // Contact form placeholder
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form.addEventListener('submit', e=>{
    e.preventDefault(); status.textContent='Sending...'; setTimeout(()=>{ status.textContent='Thanks — your message was sent (demo).'; form.reset(); },900);
  });

  // Extra animated behaviors: sticky header, parallax, ring rotation, magnetic buttons, tilts, spotlight
  const header = document.getElementById('site-header');
  const photoRing = document.querySelector('.photo-ring');
  const heroMedia = document.querySelector('.hero-media');
  const projectFeature = document.querySelector('.project-feature');
  const backToTopLink = document.querySelector('.site-footer a[href="#hero"]');

  function onScroll(){
    const y = window.scrollY;
    if(y>24) header.classList.add('sticky'); else header.classList.remove('sticky');

    // hero parallax
    if(heroMedia){ const t = Math.min(y*0.12,60); heroMedia.style.transform = `translateY(${t}px)`; }

    // subtle ring rotate
    if(photoRing){ const r = (y/6) % 360; photoRing.style.transform = `rotate(${r}deg)`; }

    // back to top toggle
    if(backToTopLink){ if(y>400) backToTopLink.classList.add('show'); else backToTopLink.classList.remove('show'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Magnetic button interaction (desktop)
  function addMagnetic(btn){ if(!btn) return; let rect; function move(e){ rect = btn.getBoundingClientRect(); const mx = e.clientX - (rect.left + rect.width/2); const my = e.clientY - (rect.top + rect.height/2); const dist = Math.hypot(mx,my); const max = Math.min(12, rect.width*0.06); const tx = (mx/dist)*Math.min(max,dist/6) || 0; const ty = (my/dist)*Math.min(max,dist/6) || 0; btn.style.transform = `translate(${tx}px, ${ty}px) scale(1.02)`; } function leave(){ btn.style.transform = ''; } btn.addEventListener('mousemove', move); btn.addEventListener('mouseleave', leave); }
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(addMagnetic);

  // Pointer tilt for cards
  function addTilt(el){ if(!el) return; el.addEventListener('pointermove', (e)=>{ const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width; const py = (e.clientY - r.top) / r.height; const ry = (px - 0.5) * 6; const rx = (0.5 - py) * 6; el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`; }); el.addEventListener('pointerleave', ()=>{ el.style.transform = ''; }); }
  addTilt(projectFeature);
  document.querySelectorAll('.strength-card, .topic-card, .learn-card').forEach(addTilt);

  // Spotlight for featured project via IntersectionObserver
  if('IntersectionObserver' in window && projectFeature){
    const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ projectFeature.classList.add('spotlight'); } else { projectFeature.classList.remove('spotlight'); } }); },{threshold:[0.3,0.6]});
    io.observe(projectFeature);
  }

  // Node cluster gentle jitter
  document.querySelectorAll('.node.small').forEach(n=>{ const delay = Math.random()*2000; n.style.transition = 'transform 5s ease-in-out'; setTimeout(function loop(){ const tx = (Math.random()-0.5)*6; const ty = (Math.random()-0.5)*6; n.style.transform = `translate(${tx}px, ${ty}px)`; setTimeout(loop, 4000 + Math.random()*3000); }, delay); });

  // Scroll animation observer
  if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
        }
      });
    }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});

    document.querySelectorAll('.scroll-animate, .scroll-animate-stagger').forEach(el=>observer.observe(el));
  }

  // Add scroll animation class to text elements
  setTimeout(()=>{
    document.querySelectorAll('h2, h3, h4, h5, p, .lead').forEach(el=>{
      if(!el.classList.contains('intro-title') && !el.closest('form')){
        el.classList.add('scroll-animate');
      }
    });
    
    // Re-observe new elements
    if('IntersectionObserver' in window){
      const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('in-view');
          }
        });
      }, {threshold: 0.1, rootMargin: '0px 0px -50px 0px'});
      document.querySelectorAll('.scroll-animate, .scroll-animate-stagger').forEach(el=>observer.observe(el));
    }
  }, 100);

})();
