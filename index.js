/**
 * index.js
 * ---------------------------------------------------------
 * Fetches data.json, renders every section dynamically, and
 * wires up the "Download Resume as PDF" button using html2pdf.js.
 * Any empty string in the JSON is replaced with "empty".
 * ---------------------------------------------------------
 */

/* ---- helpers ---- */

/** Return the value or "empty" when the value is falsy / blank. */
function val(v) {
  return v && v.toString().trim() !== '' ? v : 'empty';
}

/** Create an element with optional classes & inner HTML. */
function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

/* ---- renderers ---- */

function renderHero(data) {
  document.getElementById('hero-name').textContent = val(data.name);
  document.title = val(data.name) + ' — Resume';

  const contact = document.getElementById('hero-contact');
  const items = [
    {
      href: data.email ? `mailto:${data.email}` : '#',
      label: val(data.email),
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    },
    {
      href: data.github || '#',
      label: val(data.github),
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
               <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.43 9.64 8.21 11.21.6.11.82-.26.82-.57
               0-.28-.01-1.03-.02-2.02-3.34.72-4.04-1.61-4.04-1.61-.55-1.37-1.33-1.74-1.33-1.74-1.09-.74
               .08-.72.08-.72 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6
               -2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0
               1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25
               2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81
               2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.69.82.57A12.01 12.01 0 0 0 24 12.29C24 5.78
               18.63.5 12 .5z"/></svg>`,
    },
    {
      href: data.linkedin || '#',
      label: val(data.linkedin),
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
               <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13
               2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27
               5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12
               20.45H3.56V9h3.56v11.45zM22.22 0H1.77A1.75 1.75 0 0 0 0 1.73v20.54A1.75
               1.75 0 0 0 1.77 24h20.45A1.76 1.76 0 0 0 24 22.27V1.73A1.76 1.76 0 0 0
               22.22 0z"/></svg>`,
    },
  ];

  items.forEach((item) => {
    const a = el('a', 'hero__contact-item');
    a.href = item.href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = item.icon + `<span>${item.label}</span>`;
    contact.appendChild(a);
  });
}

function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  Object.values(skills).forEach((skill) => {
    const name = val(skill.skill_name);
    const proficiency = val(skill.skill_proficiency);

    const item = el('div', 'skill-item');
    item.innerHTML = `
      <div class="skill-item__name">${name}</div>
      <div class="skill-item__bar-track">
        <div class="skill-item__bar-fill" data-proficiency="${proficiency}"></div>
      </div>
      <div class="skill-item__proficiency">${proficiency}</div>
    `;
    grid.appendChild(item);
  });
}

function renderEducation(education) {
  const list = document.getElementById('education-list');
  Object.values(education).forEach((edu) => {
    const card = el('div', 'card');
    card.innerHTML = `
      <div class="card__header">
        <div>
          <div class="card__title">${val(edu.level)}</div>
          <div class="card__subtitle">${val(edu.institution)}</div>
        </div>
        <div class="card__meta">${val(edu.year)}</div>
      </div>
      <div class="card__description">GPA: ${val(edu.GPA)}</div>
    `;
    list.appendChild(card);
  });
}

function renderExperience(experience) {
  const list = document.getElementById('experience-list');
  Object.values(experience).forEach((exp) => {
    const dateRange =
      val(exp.start_year) + ' — ' + val(exp.end_year);
    const card = el('div', 'card');
    card.innerHTML = `
      <div class="card__header">
        <div>
          <div class="card__title">${val(exp.positions)}</div>
          <div class="card__subtitle">${val(exp.institution)}</div>
        </div>
        <div class="card__meta">${dateRange}</div>
      </div>
      <div class="card__description">${val(exp.description)}</div>
    `;
    list.appendChild(card);
  });
}

function renderFooter(data) {
  document.getElementById('footer-text').textContent =
    `© ${new Date().getFullYear()} ${val(data.name)}. All rights reserved.`;
}

/* ---- intersection observer (fade-in sections) ---- */

function observeSections() {
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  sections.forEach((s) => observer.observe(s));
}

/* ---- animate skill bars ---- */

function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-item__bar-fill');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const proficiency = entry.target.dataset.proficiency;
          // Try to parse a number; otherwise default to 50%
          let pct = parseInt(proficiency, 10);
          if (isNaN(pct)) pct = 50;
          pct = Math.max(0, Math.min(100, pct));
          entry.target.style.width = pct + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  bars.forEach((b) => observer.observe(b));
}

/* ---- PDF download ---- */

function setupPDFDownload(data) {
  const btn = document.getElementById('download-pdf-btn');
  btn.addEventListener('click', () => {
    const element = document.getElementById('resume-root');

    // Temporarily force all sections visible for the PDF
    const sections = element.querySelectorAll('.section');
    sections.forEach((s) => s.classList.add('visible'));

    const filename =
      (data.name && data.name.trim() !== '' ? data.name.replace(/\s+/g, '_') : 'Resume') +
      '_Resume.pdf';

    const opt = {
      margin: [10, 10, 10, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().set(opt).from(element).save();
  });
}

/* ---- init ---- */

async function init() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Failed to load data.json');
    const data = await response.json();

    renderHero(data);
    renderSkills(data.resume_info.skills);
    renderEducation(data.resume_info.education);
    renderExperience(data.resume_info.experience);
    renderFooter(data);

    observeSections();
    animateSkillBars();
    setupPDFDownload(data);
  } catch (err) {
    console.error('Error loading resume data:', err);
    document.getElementById('hero-name').textContent = 'Error loading data';
  }
}

document.addEventListener('DOMContentLoaded', init);
