/**
 * Subtle Three.js data-network hero.
 * Simplified (or static) on small screens and when reduce-motion is set.
 */
import * as THREE from "three";

const ACCENT = 0x2dd4bf;
const NODE = 0x7dd3fc;
const LINE = 0x334155;

export function initHero3D({ reducedMotion = false } = {}) {
  const canvas = document.querySelector("#hero-canvas");
  if (!canvas || !window.WebGLRenderingContext) return;

  const isCompact = window.matchMedia("(max-width: 768px), (max-height: 500px)").matches;
  const nodeCount = isCompact ? 24 : 56;
  const linkDistance = isCompact ? 2.5 : 2.1;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isCompact,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isCompact ? 1.2 : 1.75));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 7.2);

  const group = new THREE.Group();
  scene.add(group);

  const nodes = createNodes(nodeCount);
  const positions = new Float32Array(nodeCount * 3);
  const velocities = nodes.map(() => ({
    x: (Math.random() - 0.5) * 0.004,
    y: (Math.random() - 0.5) * 0.004,
    z: (Math.random() - 0.5) * 0.004,
  }));

  nodes.forEach((n, i) => {
    positions[i * 3] = n.x;
    positions[i * 3 + 1] = n.y;
    positions[i * 3 + 2] = n.z;
  });

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const points = new THREE.Points(
    pointsGeo,
    new THREE.PointsMaterial({
      color: NODE,
      size: isCompact ? 0.07 : 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
    })
  );
  group.add(points);

  const maxLinks = isCompact ? 40 : 120;
  const linePositions = new Float32Array(maxLinks * 6);
  const linesGeo = new THREE.BufferGeometry();
  linesGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

  const lines = new THREE.LineSegments(
    linesGeo,
    new THREE.LineBasicMaterial({
      color: LINE,
      transparent: true,
      opacity: 0.55,
    })
  );
  group.add(lines);

  const accentGeo = new THREE.IcosahedronGeometry(1.15, 1);
  const accent = new THREE.Mesh(
    accentGeo,
    new THREE.MeshBasicMaterial({
      color: ACCENT,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    })
  );
  group.add(accent);

  const mouse = { x: 0, y: 0 };
  const targetRot = { x: 0.15, y: -0.35 };
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (!reducedMotion && finePointer.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
      },
      { passive: true }
    );
  }

  function resize() {
    const parent = canvas.parentElement;
    const width = Math.max(parent?.clientWidth || window.innerWidth, 1);
    const height = Math.max(parent?.clientHeight || window.innerHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", () => {
    requestAnimationFrame(resize);
  });

  if ("ResizeObserver" in window && canvas.parentElement) {
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas.parentElement);
  }

  let frameId = 0;
  let last = 0;

  function updateLinks() {
    let linkIndex = 0;
    for (let i = 0; i < nodeCount && linkIndex < maxLinks; i++) {
      for (let j = i + 1; j < nodeCount && linkIndex < maxLinks; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.hypot(dx, dy, dz);
        if (dist > linkDistance) continue;

        const offset = linkIndex * 6;
        linePositions[offset] = positions[i * 3];
        linePositions[offset + 1] = positions[i * 3 + 1];
        linePositions[offset + 2] = positions[i * 3 + 2];
        linePositions[offset + 3] = positions[j * 3];
        linePositions[offset + 4] = positions[j * 3 + 1];
        linePositions[offset + 5] = positions[j * 3 + 2];
        linkIndex += 1;
      }
    }

    linesGeo.setDrawRange(0, linkIndex * 2);
    linesGeo.attributes.position.needsUpdate = true;
  }

  function tick(now) {
    frameId = requestAnimationFrame(tick);
    const delta = Math.min((now - last) / 16.67, 2);
    last = now;

    if (!reducedMotion) {
      for (let i = 0; i < nodeCount; i++) {
        const ix = i * 3;
        const v = velocities[i];
        positions[ix] += v.x * delta;
        positions[ix + 1] += v.y * delta;
        positions[ix + 2] += v.z * delta;

        if (Math.abs(positions[ix]) > 2.6) v.x *= -1;
        if (Math.abs(positions[ix + 1]) > 2.6) v.y *= -1;
        if (Math.abs(positions[ix + 2]) > 2.6) v.z *= -1;
      }
      pointsGeo.attributes.position.needsUpdate = true;
      updateLinks();

      targetRot.y = -0.35 + mouse.x * 0.35;
      targetRot.x = 0.15 + mouse.y * 0.2;
      group.rotation.y += (targetRot.y - group.rotation.y) * 0.04;
      group.rotation.x += (targetRot.x - group.rotation.x) * 0.04;
      accent.rotation.y += 0.003 * delta;
      accent.rotation.x += 0.0015 * delta;
    }

    renderer.render(scene, camera);
  }

  updateLinks();
  renderer.render(scene, camera);

  if (reducedMotion) {
    // One static frame is enough when motion is reduced.
    return;
  }

  frameId = requestAnimationFrame(tick);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(frameId);
    } else if (!reducedMotion) {
      last = performance.now();
      frameId = requestAnimationFrame(tick);
    }
  });
}

function createNodes(count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const r = 1.2 + Math.random() * 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nodes.push({
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta) * 0.75,
      z: r * Math.cos(phi),
    });
  }
  return nodes;
}
