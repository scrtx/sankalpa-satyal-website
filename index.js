/**
 * SANKALPA SATYAL — PORTFOLIO & RESUME
 * Client-side script handling interactive tabs, data.json hydration,
 * scroll indicators, skills filtering, theme toggle, and contact interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initDataHydration();
    initSkillsFilter();
    initScrollSpy();
    initScrollProgress();
    initThemeToggle();
    initMobileNav();
    initContactActions();
    initLiveClock();
    initBackToTop();
});

/* ==========================================================================
   1. INTERACTIVE TABS SYSTEM
   ========================================================================== */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTabId = button.getAttribute('data-tab');

            // Deactivate all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            // Hide all panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Activate clicked button and target panel
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const targetPanel = document.getElementById(targetTabId);
            if (targetPanel) {
                targetPanel.classList.add('active');

                // Animate skill bars if opening skills tab
                if (targetTabId === 'tab-skills') {
                    animateSkillBars();
                }
            }
        });

        // Keyboard accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const btnArray = Array.from(tabButtons);
                const currentIndex = btnArray.indexOf(button);
                const nextIndex = e.key === 'ArrowRight'
                    ? (currentIndex + 1) % btnArray.length
                    : (currentIndex - 1 + btnArray.length) % btnArray.length;
                btnArray[nextIndex].focus();
                btnArray[nextIndex].click();
            }
        });
    });
}

function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        requestAnimationFrame(() => {
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 60);
        });
    });
}

/* ==========================================================================
   2. DATA.JSON HYDRATION & CODE VIEWER
   ========================================================================== */
function formatVal(val) {
    if (val === null || val === undefined) return '<<empty>>';
    if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed === '' ? '<<empty>>' : trimmed;
    }
    if (Array.isArray(val)) {
        const filtered = val
            .map(v => (typeof v === 'string' ? v.trim() : v))
            .filter(v => v !== null && v !== undefined && v !== '');
        return filtered.length === 0 ? '<<empty>>' : filtered.join(' // ');
    }
    return String(val);
}

function escapeHtml(str) {
    if (typeof str !== 'string') return String(str);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = text;
    }
}

function renderSkills(skillsObj) {
    const container = document.getElementById('skills-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const entries = skillsObj ? Object.entries(skillsObj) : [];

    if (entries.length === 0) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'skill-card';
        emptyCard.innerHTML = `
            <div class="skill-card-top">
                <div class="skill-name">&lt;&lt;empty&gt;&gt;</div>
                <div class="skill-pct">&lt;&lt;empty&gt;&gt;</div>
            </div>
            <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width: 0%;"></div>
            </div>
        `;
        container.appendChild(emptyCard);
        return;
    }

    entries.forEach(([key, skill], index) => {
        const name = formatVal(skill ? skill.skill_name : null);
        const pctText = formatVal(skill ? skill.skill_proficiency : null);

        let barWidth = '0%';
        if (pctText !== '<<empty>>') {
            const num = parseInt(pctText, 10);
            if (!isNaN(num) && num > 0) {
                barWidth = `${Math.min(100, Math.max(0, num))}%`;
            }
        }

        const card = document.createElement('div');
        card.className = 'skill-card';
        card.innerHTML = `
            <div class="skill-card-top">
                <div class="skill-name" id="data-skill${index + 1}-name">${escapeHtml(name)}</div>
                <div class="skill-pct" id="data-skill${index + 1}-pct">${escapeHtml(pctText)}</div>
            </div>
            <div class="skill-bar-track">
                <div class="skill-bar-fill" style="width: ${barWidth};"></div>
            </div>
        `;
        container.appendChild(card);
    });
}

function applyData(data) {
    const jsonDisplay = document.getElementById('json-code-display');
    if (jsonDisplay) {
        jsonDisplay.textContent = JSON.stringify(data, null, 4);
    }

    // Hydrate Name
    const name = formatVal(data.name);
    setText('data-name-brand', name);
    setText('data-name-hero', name === '<<empty>>' ? '<<empty>>' : name.toUpperCase());
    setText('data-name-about', name);
    setText('data-quote-author', `— ${name}`);
    setText('data-name-footer', name === '<<empty>>' ? '<<empty>>' : name.toUpperCase());

    const footerCopy = document.getElementById('data-footer-copy');
    if (footerCopy) {
        footerCopy.textContent = `© 2026 ${name}. Kathmandu University (2019–2024). All rights reserved.`;
    }
    document.title = `${name} — Portfolio & Resume`;

    // Hydrate Contacts
    const email = formatVal(data.email);
    setText('data-contact-email', email);

    const github = formatVal(data.github);
    setText('data-contact-github', github);
    const ghLink = document.getElementById('github-link-tag');
    if (ghLink) {
        if (github !== '<<empty>>') {
            ghLink.href = github.startsWith('http') ? github : `https://${github}`;
            ghLink.classList.remove('disabled');
        } else {
            ghLink.href = '#';
            ghLink.classList.add('disabled');
        }
    }

    const linkedin = formatVal(data.linkedin);
    setText('data-contact-linkedin', linkedin);
    const liLink = document.getElementById('linkedin-link-tag');
    if (liLink) {
        if (linkedin !== '<<empty>>') {
            liLink.href = linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
            liLink.classList.remove('disabled');
        } else {
            liLink.href = '#';
            liLink.classList.add('disabled');
        }
    }

    // Hydrate Resume Info
    if (data.resume_info) {
        // Education
        if (data.resume_info.education) {
            const edu = data.resume_info.education;
            if (edu.education2) {
                const e2 = edu.education2;
                const inst = formatVal(e2.institution);
                const level = formatVal(e2.level);
                const year = formatVal(e2.year);
                const gpa = formatVal(e2.GPA);

                setText('data-edu2-inst', inst);
                setText('data-edu2-level', level !== '<<empty>>' ? `Level: ${level}` : '<<empty>>');
                setText('data-edu2-year', year);
                setText('data-edu2-desc', `GPA: ${gpa}`);
                setText('data-edu2-tag-inst', inst);
                setText('data-edu2-tag-year', year);
                setText('data-edu2-tag-gpa', `GPA: ${gpa}`);

                setText('data-edu2-inst-about', inst);
                setText('stat-edu2-inst', inst);
                setText('stat-edu2-year', year);
                setText('stat-edu2-level', level !== '<<empty>>' ? `Level: ${level}` : '<<empty>>');
            }

            if (edu.education1) {
                const e1 = edu.education1;
                const inst = formatVal(e1.institution);
                const level = formatVal(e1.level);
                const year = formatVal(e1.year);
                const gpa = formatVal(e1.GPA);

                setText('data-edu1-inst', inst);
                setText('data-edu1-level', level !== '<<empty>>' ? `Level: ${level}` : '<<empty>>');
                setText('data-edu1-year', year);
                setText('data-edu1-desc', `GPA: ${gpa}`);
                setText('data-edu1-tag-inst', inst);
                setText('data-edu1-tag-year', year);
                setText('data-edu1-tag-gpa', `GPA: ${gpa}`);

                setText('data-edu1-inst-about', inst);
                setText('stat-edu1-inst', inst);
                setText('stat-edu1-year', year);
                setText('stat-edu1-level', level !== '<<empty>>' ? `Level: ${level}` : '<<empty>>');
            }
        }

        // Skills
        if (data.resume_info.skills) {
            renderSkills(data.resume_info.skills);
        }

        // Experience
        if (data.resume_info.experience) {
            const exp = data.resume_info.experience;
            const inst = formatVal(exp.institution);
            const positions = formatVal(exp.positions);
            const desc = formatVal(exp.description);

            let period = '<<empty>>';
            const start = typeof exp.start_year === 'string' ? exp.start_year.trim() : exp.start_year;
            const end = typeof exp.end_year === 'string' ? exp.end_year.trim() : exp.end_year;
            if (start && end) {
                period = `${start} – ${end}`;
            } else if (start) {
                period = `${start} – Present`;
            } else if (end) {
                period = end;
            }

            setText('data-exp-institution', inst);
            setText('data-exp-positions', positions);
            setText('data-exp-period', period);
            setText('data-exp-desc', desc);

            const tagsContainer = document.getElementById('data-exp-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = '';
                if (inst !== '<<empty>>' || positions !== '<<empty>>') {
                    if (inst !== '<<empty>>') {
                        const t1 = document.createElement('div');
                        t1.className = 'pill-tag';
                        t1.textContent = inst;
                        tagsContainer.appendChild(t1);
                    }
                    if (positions !== '<<empty>>') {
                        const t2 = document.createElement('div');
                        t2.className = 'pill-tag';
                        t2.textContent = positions;
                        tagsContainer.appendChild(t2);
                    }
                } else {
                    const t = document.createElement('div');
                    t.className = 'pill-tag';
                    t.textContent = '<<empty>>';
                    tagsContainer.appendChild(t);
                }
            }
        }
    }
}

function initDataHydration() {
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            applyData(data);
        })
        .catch(err => {
            console.info('data.json fetch encountered:', err.message);
            const jsonDisplay = document.getElementById('json-code-display');
            if (jsonDisplay) {
                jsonDisplay.textContent = '// Note: data.json accessed with direct values.';
            }
        });
}

/* ==========================================================================
   3. SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
    const chips = document.querySelectorAll('.filter-chip');

    if (!chips.length) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.getAttribute('data-filter');
            const skillCards = document.querySelectorAll('.skill-card');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || !category || category === filter) {
                    card.style.display = '';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });
}

/* ==========================================================================
   4. SCROLL SPY & SMOOTH NAVIGATION
   ========================================================================== */
function initScrollSpy() {
    const navItems = document.querySelectorAll('.nav-item');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const actionButtons = document.querySelectorAll('[data-target]');
    const sections = document.querySelectorAll('.page-section');

    // Click to scroll
    const triggerScroll = (targetId) => {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const header = document.getElementById('site-header');
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight + 2;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) triggerScroll(target);
        });
    });

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.getAttribute('data-target');
            if (target) {
                triggerScroll(target);
                const panel = document.getElementById('mobile-nav-panel');
                if (panel) panel.classList.remove('open');
            }
        });
    });

    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            if (target) triggerScroll(target);
        });
    });

    // Brand logo scroll to top
    const brand = document.querySelector('.header-brand');
    if (brand) {
        brand.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ScrollSpy using IntersectionObserver
    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.id;
                    navItems.forEach(nav => {
                        if (nav.getAttribute('data-target') === currentId) {
                            nav.classList.add('active');
                        } else {
                            nav.classList.remove('active');
                        }
                    });
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }
}

/* ==========================================================================
   5. SCROLL PROGRESS INDICATOR (Along Right Border)
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.height = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
}

/* ==========================================================================
   6. THEME INVERT TOGGLE
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('mode-inverted');
        const isInverted = document.body.classList.contains('mode-inverted');
        showToast(isInverted ? 'Palette Inverted: Cream dominant' : 'Palette Standard: Black dominant');
    });
}

/* ==========================================================================
   7. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const panel = document.getElementById('mobile-nav-panel');

    if (!toggle || !panel) return;

    toggle.addEventListener('click', () => {
        panel.classList.toggle('open');
    });
}

/* ==========================================================================
   8. CONTACT CHANNEL ACTIONS (Copy Email & External Links)
   ========================================================================== */
function initContactActions() {
    // Copy Email
    const copyBtn = document.getElementById('copy-email-btn');
    const emailEl = document.getElementById('data-contact-email');

    if (copyBtn && emailEl) {
        copyBtn.addEventListener('click', () => {
            const email = emailEl.textContent.trim();
            if (!email || email === '<<empty>>') {
                showToast('No email address specified in data.json');
                return;
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(() => showToast('Email copied to clipboard'))
                    .catch(() => fallbackCopy(email));
            } else {
                fallbackCopy(email);
            }
        });
    }

    function fallbackCopy(text) {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Email copied to clipboard');
    }

    // GitHub & LinkedIn profile links
    const ghLink = document.getElementById('github-link-tag');
    if (ghLink) {
        ghLink.addEventListener('click', (e) => {
            const val = document.getElementById('data-contact-github');
            if (!val || val.textContent.trim() === '<<empty>>' || ghLink.getAttribute('href') === '#') {
                e.preventDefault();
                showToast('No GitHub profile specified in data.json');
            }
        });
    }

    const liLink = document.getElementById('linkedin-link-tag');
    if (liLink) {
        liLink.addEventListener('click', (e) => {
            const val = document.getElementById('data-contact-linkedin');
            if (!val || val.textContent.trim() === '<<empty>>' || liLink.getAttribute('href') === '#') {
                e.preventDefault();
                showToast('No LinkedIn profile specified in data.json');
            }
        });
    }
}

/* ==========================================================================
   9. TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('site-toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

/* ==========================================================================
   10. LIVE CLOCK (Kathmandu / Local)
   ========================================================================== */
function initLiveClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const options = { timeZone: 'Asia/Kathmandu', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        try {
            const timeString = new Intl.DateTimeFormat([], options).format(now);
            clockEl.textContent = `Kathmandu // ${timeString} NPT`;
        } catch (e) {
            clockEl.textContent = `Kathmandu, NP`;
        }
    }

    update();
    setInterval(update, 1000);
}

/* ==========================================================================
   11. BACK TO TOP
   ========================================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-to-top-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

