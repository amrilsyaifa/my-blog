"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export default function ContactScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;
    if (W === 0 || H === 0) return;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 5.5;

    // ── Lights ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const pLight = new THREE.PointLight(0xec7a56, 3, 20);
    pLight.position.set(2, 2, 3);
    scene.add(pLight);

    // ── Group (mouse rotation applied here) ───────────────
    const group = new THREE.Group();
    scene.add(group);

    // ── Central sphere ────────────────────────────────────
    const ACCENT = 0xec7a56;
    const coreMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.25, metalness: 0.8 })
    );
    group.add(coreMesh);

    const wireFrame = new THREE.Mesh(
      new THREE.SphereGeometry(0.73, 16, 16),
      new THREE.MeshBasicMaterial({ color: ACCENT, wireframe: true, transparent: true, opacity: 0.15 })
    );
    group.add(wireFrame);

    // ── Particles ─────────────────────────────────────────
    const N = 24;
    const pGeo = new THREE.SphereGeometry(0.045, 7, 7);
    const particles: { mesh: THREE.Mesh; angle: number; speed: number; tilt: number; r: number }[] = [];

    for (let i = 0; i < N; i++) {
      const mesh = new THREE.Mesh(
        pGeo,
        new THREE.MeshStandardMaterial({ color: ACCENT, roughness: 0.3, metalness: 0.6 })
      );
      const angle = Math.random() * Math.PI * 2;
      const tilt  = Math.random() * Math.PI;
      const r     = 1.5 + Math.random() * 1.8;
      const speed = (0.002 + Math.random() * 0.004) * (Math.random() < 0.5 ? 1 : -1);
      mesh.position.set(
        r * Math.sin(tilt) * Math.cos(angle),
        r * Math.sin(tilt) * Math.sin(angle),
        r * Math.cos(tilt)
      );
      group.add(mesh);
      particles.push({ mesh, angle, speed, tilt, r });
    }

    // ── Line segments (pre-allocated buffer) ──────────────
    const MAX_LINES = N * (N - 1) / 2;
    const linePositions = new Float32Array(MAX_LINES * 6); // 2 pts × 3 coords
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0 });
    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lineSegments);

    // ── Mouse ─────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    mount.addEventListener("mousemove", onMouse);

    // ── GSAP entrance ─────────────────────────────────────
    group.scale.setScalar(0);
    gsap.to(group.scale,  { x: 1, y: 1, z: 1, duration: 1.4, ease: "elastic.out(1, 0.6)", delay: 0.2 });
    gsap.to(lineMat,      { opacity: 0.22, duration: 1.6, delay: 0.6 });

    // ── Render loop ───────────────────────────────────────
    let raf: number;
    let t = 0;
    const THRESHOLD = 1.5;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.01;

      coreMesh.rotation.y  += 0.006;
      wireFrame.rotation.x += 0.004;
      wireFrame.rotation.y -= 0.003;
      pLight.intensity = 2.6 + Math.sin(t * 1.4) * 0.5;

      particles.forEach((p, i) => {
        p.angle += p.speed;
        p.mesh.position.set(
          p.r * Math.sin(p.tilt) * Math.cos(p.angle),
          p.r * Math.sin(p.tilt) * Math.sin(p.angle) + Math.sin(t + i * 0.45) * 0.12,
          p.r * Math.cos(p.tilt)
        );
      });

      let li = 0;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const pi = particles[i].mesh.position;
          const pj = particles[j].mesh.position;
          if (pi.distanceTo(pj) < THRESHOLD) {
            linePositions[li * 6 + 0] = pi.x; linePositions[li * 6 + 1] = pi.y; linePositions[li * 6 + 2] = pi.z;
            linePositions[li * 6 + 3] = pj.x; linePositions[li * 6 + 4] = pj.y; linePositions[li * 6 + 5] = pj.z;
            li++;
          }
        }
      }
      lineGeo.setDrawRange(0, li * 2);
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      group.rotation.x += (mouse.y * 0.35 - group.rotation.x) * 0.05;
      group.rotation.y += (mouse.x * 0.35 - group.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };
    tick();

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
