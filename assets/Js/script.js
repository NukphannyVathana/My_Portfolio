/* ═══════════════════════════════════════════════════════════════
   NUKPHANNY VATHANA — DIGITAL CV  |  script.js
   All interactive behavior
═══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   SCROLL PROGRESS BAR + BACK TO TOP
══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scroll-bar').style.width = pct + '%';
  document.getElementById('back-top').classList.toggle('show', window.scrollY > 400);
});

/* ══════════════════════════════════════
   TYPING / GLITCH HERO NAME
══════════════════════════════════════ */
(function() {
  const el = document.getElementById('typing-name');
  if (!el) return;
  const lines = ['NUKPHANNY', 'VATHANA'];
  let lineIdx = 0, charIdx = 0;
  el.textContent = '';

  function type() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      el.innerHTML = lines.slice(0, lineIdx).join('<br>') +
        (lineIdx > 0 ? '<br>' : '') + line.slice(0, charIdx + 1);
      charIdx++;
      setTimeout(type, 85);
    } else {
      lineIdx++;
      charIdx = 0;
      setTimeout(type, 260);
    }
  }
  setTimeout(type, 700);
})();

/* ══════════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════ */
(function() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  targets.forEach(t => obs.observe(t));
})();

/* ══════════════════════════════════════
   WORD FADE (About summary)
══════════════════════════════════════ */
(function() {
  const el = document.getElementById('summary-text');
  if (!el) return;
  const raw = el.innerText.trim();
  el.innerHTML = raw.split(/(\s+)/).map((chunk, i) => {
    if (!chunk.trim()) return chunk;
    return `<span style="transition-delay:${i * 0.04}s">${chunk}</span>`;
  }).join('');
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) el.classList.add('visible');
  }, { threshold: 0.2 });
  obs.observe(el);
})();

/* ══════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════ */
(function() {
  const counters = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur;
        if (cur >= target) clearInterval(timer);
      }, 40);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
})();

/* ══════════════════════════════════════
   SKILL BARS — animate on scroll
══════════════════════════════════════ */
(function() {
  const bars = document.querySelectorAll('.retro-bar-fill');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => obs.observe(b));
})();

/* ══════════════════════════════════════
   ACTIVE NAV LINK on scroll
══════════════════════════════════════ */
(function() {
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  secs.forEach(s => obs.observe(s));
})();

/* ══════════════════════════════════════
   HAMBURGER MOBILE MENU
══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

if (hamburger) {
  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.display = menuOpen ? 'flex' : 'none';
    const sp = hamburger.querySelectorAll('span');
    sp[0].style.transform = menuOpen ? 'translateY(7px) rotate(45deg)' : '';
    sp[1].style.opacity   = menuOpen ? '0' : '1';
    sp[2].style.transform = menuOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });
}

function closeMobile() {
  menuOpen = false;
  mobileMenu.style.display = 'none';
  const sp = hamburger.querySelectorAll('span');
  sp[0].style.transform = '';
  sp[1].style.opacity   = '1';
  sp[2].style.transform = '';
}

/* ══════════════════════════════════════
   PROJECT CARD — "Add New Project"
   (Opens a simple prompt dialog)
══════════════════════════════════════ */
function addNewProject() {
  alert('📂 TO ADD A PROJECT:\n\n1. Open "index.html" in a code editor\n2. Find the section id="projects"\n3. Copy any existing .project-card block\n4. Update: title, description, tech tags, demo link, code link\n5. Change the thumb colour class (thumb-pink / thumb-cyan / thumb-yellow / thumb-green)\n\nSave the file and refresh the browser!');
}

/* ══════════════════════════════════════
   PDF DOWNLOAD
══════════════════════════════════════ */
window.downloadPDF = function() {
  const btn = document.getElementById('dl-btn');
  btn.textContent = 'GENERATING...';
  btn.disabled = true;

  html2pdf().set({
    margin: 0,
    filename: 'Nukphanny_Vathana_CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#06000f' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' }
  }).from(document.body).save().then(() => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" style="width:14px;height:14px">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
    </svg> DOWNLOAD.PDF`;
    btn.disabled = false;
  });
};

/* ══════════════════════════════════════
   PROJECT CARD HOVER TILT (3D effect)
══════════════════════════════════════ */
(function() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -6;
      const rotY = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
