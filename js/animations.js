/**
 * Scroll reveals and service-card tilt. CSS-driven; no GSAP dependency.
 * Respects prefers-reduced-motion.
 */
export function initAnimations({ reducedMotion = false } = {}) {
  initReveals(reducedMotion);

  const canTilt =
    !reducedMotion &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (canTilt) initCardTilt();
}

function initReveals(reducedMotion) {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  items.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(el);
  });
}

function initCardTilt() {
  const cards = document.querySelectorAll("[data-tilt]");
  if (!cards.length) return;

  const maxTilt = 7;

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - y) * maxTilt * 2;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}
