/**
 * BAYTO LLC — app entry
 * Boots navigation, form, scroll reveals, card tilt, and the 3D hero.
 */
import { initNav } from "./nav.js";
import { initForm } from "./form.js";
import { initAnimations } from "./animations.js";
import { initHero3D } from "./hero3d.js";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion) {
  document.documentElement.classList.add("reduced-motion");
}

initNav();
initForm();
initAnimations({ reducedMotion: prefersReducedMotion });
initHero3D({ reducedMotion: prefersReducedMotion });
