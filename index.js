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
function initDataHydration() {
    const jsonDisplay = document.getElementById('json-code-display');

    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Render formatted JSON in the viewer tab
            if (jsonDisplay) {
                jsonDisplay.textContent = JSON.stringify(data, null, 4);
            }

            // Hydrate Name
            if (data.name && data.name.trim() !== '') {
                const brandName = document.getElementById('data-name-brand');
                const heroName = document.getElementById('data-name-hero');
                const aboutName = document.getElementById('data-name-about');
                if (brandName) brandName.textContent = data.name;
                if (heroName) heroName.textContent = data.name.toUpperCase();
                if (aboutName) aboutName.textContent = data.name;
                document.title = `${data.name} — Portfolio & Resume`;
            }

            // Hydrate Resume Info if present
            if (data.resume_info) {
                // Education
                if (data.resume_info.education) {
                    const edu = data.resume_info.education;
                    if (edu.education1) {
                        const e1 = edu.education1;
                        if (e1.institution) setText('data-edu1-inst', e1.institution);
                        if (e1.level) setText('data-edu1-level', `Level: ${e1.level}`);
                        if (e1.year) setText('data-edu1-year', e1.year);
                    }
                    if (edu.education2) {
                        const e2 = edu.education2;
                        if (e2.institution) setText('data-edu2-inst', e2.institution);
                        if (e2.level) setText('data-edu2-level', `Level: ${e2.level}`);
                        if (e2.year) setText('data-edu2-year', e2.year);
                    }
                }

                // Skills
                if (data.resume_info.skills) {
                    const skills = data.resume_info.skills;
                    if (skills.skill1 && skills.skill1.skill_name) {
                        setText('data-skill1-name', skills.skill1.skill_name);
                        if (skills.skill1.skill_proficiency) setText('data-skill1-pct', skills.skill1.skill_proficiency);
                    }
                    if (skills.skill2 && skills.skill2.skill_name) {
                        setText('data-skill2-name', skills.skill2.skill_name);
                        if (skills.skill2.skill_proficiency) setText('data-skill2-pct', skills.skill2.skill_proficiency);
                    }
                    if (skills.skill3 && skills.skill3.skill_name) {
                        setText('data-skill3-name', skills.skill3.skill_name);
                        if (skills.skill3.skill_proficiency) setText('data-skill3-pct', skills.skill3.skill_proficiency);
                    }
                }

                // Experience
                if (data.resume_info.experience) {
                    const exp = data.resume_info.experience;
                    if (exp.institution && exp.institution.trim() !== '') {
                        setText('data-exp-institution', exp.institution);
                    }
                    if (Array.isArray(exp.positions) && exp.positions.filter(p => p && p.trim() !== '').length > 0) {
                        setText('data-exp-positions', exp.positions.filter(p => p && p.trim() !== '').join(' // '));
                    }
                    if (exp.start_year || exp.end_year) {
                        const period = `${exp.start_year || '2023'} – ${exp.end_year || 'Present'}`;
                        setText('data-exp-period', period);
                    }
                    if (exp.description && exp.description.trim() !== '') {
                        setText('data-exp-desc', exp.description);
                    }
                }
            }

            // Hydrate Contacts
            if (data.email && data.email.trim() !== '') {
                setText('data-contact-email', data.email);
            }
            if (data.github && data.github.trim() !== '') {
                setText('data-contact-github', data.github);
                const ghLink = document.getElementById('github-link-tag');
                if (ghLink) ghLink.href = data.github.startsWith('http') ? data.github : `https://${data.github}`;
            }
            if (data.linkedin && data.linkedin.trim() !== '') {
                setText('data-contact-linkedin', data.linkedin);
                const liLink = document.getElementById('linkedin-link-tag');
                if (liLink) liLink.href = data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`;
            }
        })
        .catch(err => {
            console.info('data.json loaded with default static values:', err.message);
            if (jsonDisplay) {
                jsonDisplay.textContent = '// Loaded fallback content. data.json structure is active.';
            }
        });
}

function setText(elementId, text) {
    const el = document.getElementById(elementId);
    if (el && text) {
        el.textContent = text;
    }
}

/* ==========================================================================
   3. SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
    const chips = document.querySelectorAll('.filter-chip');
    const skillCards = document.querySelectorAll('.skill-card');

    if (!chips.length) return;

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            const filter = chip.getAttribute('data-filter');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
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
   8. CONTACT FORM & ACTIONS (Copy Email + Dispatch)
   ========================================================================== */
function initContactActions() {
    // Copy Email
    const copyBtn = document.getElementById('copy-email-btn');
    const emailEl = document.getElementById('data-contact-email');

    if (copyBtn && emailEl) {
        copyBtn.addEventListener('click', () => {
            const email = emailEl.textContent.trim();
            if (navigator.clipboard) {
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

    // Message dispatch form
    const submitBtn = document.getElementById('btn-submit-message');
    const feedback = document.getElementById('form-feedback');
    const nameInput = document.getElementById('input-sender-name');
    const emailInput = document.getElementById('input-sender-email');
    const msgInput = document.getElementById('input-sender-msg');

    if (submitBtn && feedback) {
        submitBtn.addEventListener('click', () => {
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const msg = msgInput ? msgInput.value.trim() : '';

            if (!name || !email || !msg) {
                feedback.className = 'form-feedback-message error';
                feedback.textContent = 'Please complete all required fields before dispatching.';
                return;
            }

            feedback.className = 'form-feedback-message success';
            feedback.textContent = `Thank you, ${name}. Your message has been prepared for dispatch.`;

            // Reset inputs
            if (nameInput) nameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (msgInput) msgInput.value = '';

            showToast('Dispatch prepared successfully');
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

