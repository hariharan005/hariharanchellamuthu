/* ================
   Basic utilities
   ================ */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  menuBtn && menuBtn.addEventListener('click', () => {
    navLinks.style.display = (navLinks.style.display === 'flex') ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
  });

  // Smooth active nav on scroll
  const navItems = $$('.nav-link');
  const sections = navItems.map(a => document.querySelector(a.getAttribute('href')));
  function onScroll() {
    const scrollPos = window.scrollY + 120;
    for (let i = sections.length-1; i >= 0; i--) {
      const s = sections[i];
      if (!s) continue;
      if (scrollPos >= s.offsetTop) {
        navItems.forEach(n => n.classList.remove('active'));
        navItems[i].classList.add('active');
        break;
      }
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Typing effect
  const roles = ["Full Stack Developer", "Cybersecurity Engineer", "IoT Developer", "Digital Creator"];
  let ri = 0, cj = 0, deleting=false;
  const typeEl = $('#typewriter');
  function typeLoop(){
    const text = roles[ri];
    if (!deleting) {
      cj++;
      typeEl.textContent = text.slice(0, cj);
      if (cj === text.length) { deleting = true; setTimeout(typeLoop, 900); return; }
    } else {
      cj--;
      typeEl.textContent = text.slice(0, cj);
      if (cj === 0) { deleting = false; ri = (ri+1)%roles.length; }
    }
    setTimeout(typeLoop, deleting?60:100);
  }
  typeLoop();

  // IntersectionObserver reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('show');
    });
  }, {threshold: 0.12});

  $$('.animate').forEach(el => io.observe(el));

  // Parallax effect
  const layers = $$('.parallax-layer');
  window.addEventListener('mousemove', (ev) => {
    const w = window.innerWidth, h = window.innerHeight;
    const nx = (ev.clientX - w/2)/w, ny = (ev.clientY - h/2)/h;
    layers.forEach((el, idx) => {
      const mul = (idx+1)*10;
      el.style.transform = `translate(${nx*mul}px, ${ny*mul}px)`;
    });
  });

  // Tilt effect for .tilt cards
  $$('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width;
      const py = (e.clientY - r.top)/r.height;
      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 12;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Testimonial slider (simple)
  const slides = $$('#testimonialSlider .slide');
  let curSlide = 0;
  function showSlide(idx){
    slides.forEach((s,i) => s.style.display = (i===idx?'block':'none'));
  }
  showSlide(0);
  const next = $('#nextSlide'), prev = $('#prevSlide');
  next && next.addEventListener('click', () => { curSlide = (curSlide+1)%slides.length; showSlide(curSlide); });
  prev && prev.addEventListener('click', () => { curSlide = (curSlide-1+slides.length)%slides.length; showSlide(curSlide); });

  // autoplay
  setInterval(() => { curSlide = (curSlide+1)%slides.length; showSlide(curSlide); }, 6000);

  // Contact form demo handler
  const form = $('#contactForm');
  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    // fake success - show a toast-like message
    const ok = document.createElement('div');
    ok.className = 'glass-card';
    ok.style.position = 'fixed'; ok.style.right = '18px'; ok.style.bottom = '86px'; ok.style.zIndex = 120;
    ok.textContent = `Thanks ${name || 'there'} — message received (demo).`;
    document.body.appendChild(ok);
    setTimeout(()=> ok.remove(), 3000);
    form.reset();
  });

  // Theme toggle + persistence
  const themeToggle = $('#themeToggle');
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  if (currentTheme === 'light') document.body.classList.add('light');
  themeToggle && themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });

  // Download CV placeholder action
  $('#downloadCv').on('click', function(e) {
    e.preventDefault();

    // Replace with your actual PDF file
    const pdfUrl = "assets/Resume.pdf";

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = "assets/Resume.pdf";
    link.click();
});


  // Close mobile nav when a link clicked
  $$('.nav-link').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth < 900) navLinks.style.display = 'none';
  }));

  // Small accessibility improvement: focus visible styles when tabbing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  });
});
