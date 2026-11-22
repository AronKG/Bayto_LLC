/**
 * Sticky header navigation: mobile menu, active section, sticky CTA visibility.
 */
export function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  const stickyCta = document.querySelector(".sticky-inquiry");
  const inquiry = document.querySelector("#inquiry");
  const links = document.querySelectorAll('.site-nav a[href^="#"]');

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  if (stickyCta && inquiry) {
    const syncSticky = () => {
      const rect = inquiry.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      stickyCta.classList.toggle("is-hidden", inView);
    };

    syncSticky();
    window.addEventListener("scroll", syncSticky, { passive: true });
    window.addEventListener("resize", syncSticky);
  }

  const sections = ["services", "approach", "about"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = new Map(
    [...document.querySelectorAll('.nav-list a[href^="#"]')].map((a) => [
      a.getAttribute("href").slice(1),
      a,
    ])
  );

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.removeAttribute("aria-current"));
        const active = navLinks.get(entry.target.id);
        if (active) active.setAttribute("aria-current", "true");
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}
