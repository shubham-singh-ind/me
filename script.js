/**
 * Portfolio — Shubham Singh
 * Tailwind CDN config must run immediately after the CDN script (see index.html order).
 */

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(99, 102, 241, 0.45)",
      },
    },
  },
};

(function () {
  "use strict";

  const SELECTORS = {
    loader: "#loader",
    themeToggle: "#theme-toggle",
    navOpen: "#nav-open",
    mobilePanel: "#mobile-panel",
    navLinks: ".nav-link, .mobile-nav-link",
    header: ".header",
    contactForm: "#contact-form",
    formStatus: "#form-status",
    year: "#year",
    typingLine: "#typing-line",
    canvas: "#particles",
  };

  const STORAGE_KEY = "portfolio-theme";
  const SECTION_IDS = [
    "hero",
    "about",
    "skills",
    "experience",
    "projects",
    "achievements",
    "contact",
  ];

  const TYPING_PHRASES = [
    "Building scalable web apps with performance in mind",
    "E-commerce, SaaS, and platforms that stay fast under load",
  ];

  function getEl(sel) {
    return document.querySelector(sel);
  }

  function getAll(sel) {
    return document.querySelectorAll(sel);
  }

  function applyTheme(dark) {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch (_) {}
  }

  function initTheme() {
    let dark = false;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark") dark = true;
      else if (stored === "light") dark = false;
      else dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (_) {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    applyTheme(dark);

    const btn = getEl(SELECTORS.themeToggle);
    if (btn) {
      btn.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");
        try {
          localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
        } catch (_) {}
      });
    }
  }

  function hideLoader() {
    const loader = getEl(SELECTORS.loader);
    if (!loader) return;
    requestAnimationFrame(() => {
      loader.classList.add("is-hidden");
      setTimeout(() => loader.remove(), 600);
    });
  }

  function initMobileNav() {
    const openBtn = getEl(SELECTORS.navOpen);
    const panel = getEl(SELECTORS.mobilePanel);
    if (!openBtn || !panel) return;

    function setOpen(open) {
      openBtn.setAttribute("aria-expanded", String(open));
      openBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        panel.hidden = false;
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
        panel.hidden = true;
      }
    }

    setOpen(false);

    openBtn.addEventListener("click", () => {
      const open = openBtn.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    panel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });
  }

  function initScrollHeader() {
    const header = getEl(SELECTORS.header);
    if (!header) return;
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle("is-scrolled", window.scrollY > 24);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initActiveNav() {
    const links = getAll(SELECTORS.navLinks);
    if (!links.length) return;

    const sectionEls = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);

    function setActive(id) {
      links.forEach((link) => {
        const sec = link.getAttribute("data-section");
        if (sec === id) link.classList.add("nav-link--active");
        else link.classList.remove("nav-link--active");
      });
    }

    function headerOffset() {
      return getEl(SELECTORS.header)?.offsetHeight || 64;
    }

    let ticking = false;
    function updateActive() {
      const marker = window.scrollY + headerOffset() + 32;
      let activeId = "hero";
      for (let i = 0; i < sectionEls.length; i++) {
        const el = sectionEls[i];
        const top = el.offsetTop;
        if (marker >= top) {
          activeId = el.dataset.section || el.id;
        }
      }
      setActive(activeId);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive, { passive: true });
    updateActive();
  }

  function initReveal() {
    const els = getAll(".reveal");
    if (!els.length) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  function runTyping(element, phrases, options) {
    const opts = options || {};
    const speed = opts.speed || 42;
    const pauseEnd = opts.pauseEnd || 2200;
    const pauseDelete = opts.pauseDelete || 600;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const phrase = phrases[phraseIndex % phrases.length];
      if (!deleting) {
        charIndex++;
        element.textContent = phrase.slice(0, charIndex);
        if (charIndex >= phrase.length) {
          deleting = true;
          return setTimeout(tick, pauseEnd);
        }
      } else {
        charIndex--;
        element.textContent = phrase.slice(0, Math.max(0, charIndex));
        if (charIndex <= 0) {
          deleting = false;
          phraseIndex++;
          return setTimeout(tick, pauseDelete);
        }
      }
      const delay = deleting ? speed / 2 : speed + Math.random() * 20;
      setTimeout(tick, delay);
    }

    element.classList.add("typing");
    tick();
  }

  function initTyping() {
    const el = getEl(SELECTORS.typingLine);
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = TYPING_PHRASES[0];
      return;
    }
    runTyping(el, TYPING_PHRASES, { speed: 38, pauseEnd: 2800, pauseDelete: 500 });
  }

  function initContactForm() {
    const form = getEl(SELECTORS.contactForm);
    const status = getEl(SELECTORS.formStatus);
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();
      if (!name || !email || !message) {
        if (status) {
          status.textContent = "Please fill in all fields.";
          status.classList.remove("hidden", "text-emerald-600", "dark:text-emerald-400");
          status.classList.add("text-rose-600", "dark:text-rose-400");
        }
        return;
      }
      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}\n`
      );
      const mailto = `mailto:shubh.singh.it@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      if (status) {
        status.textContent = "Opening your email app…";
        status.classList.remove("hidden", "text-rose-600", "dark:text-rose-400");
        status.classList.add("text-emerald-600", "dark:text-emerald-400");
      }
    });
  }

  function initYear() {
    const y = getEl(SELECTORS.year);
    if (y) y.textContent = String(new Date().getFullYear());
  }

  /**
   * Lightweight particle field — connects nearby nodes for a subtle tech aesthetic.
   */
  function initParticles() {
    const canvas = getEl(SELECTORS.canvas);
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const particles = [];
    const COUNT = 55;
    const maxDist = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function spawn() {
      particles.length = 0;
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.classList.contains("dark");
      const dot = isDark ? "rgba(148, 163, 184, 0.5)" : "rgba(100, 116, 139, 0.45)";
      const lineBase = isDark ? [129, 140, 248] : [99, 102, 241];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.fillStyle = dot;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * (isDark ? 0.14 : 0.12);
            ctx.strokeStyle = `rgba(${lineBase[0]}, ${lineBase[1]}, ${lineBase[2]}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      canvas.classList.add("hidden");
      return;
    }

    resize();
    spawn();
    step();

    window.addEventListener(
      "resize",
      () => {
        resize();
        spawn();
      },
      { passive: true }
    );
  }

  function boot() {
    initTheme();
    initMobileNav();
    initScrollHeader();
    initActiveNav();
    initReveal();
    initTyping();
    initContactForm();
    initYear();
    initParticles();
    if (document.readyState === "complete") hideLoader();
    else window.addEventListener("load", hideLoader, { once: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
