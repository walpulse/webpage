"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type TxArrivePayload = {
  /** 0–100, percentage of canvas width */
  xPct: number;
  /** 0–100, percentage of canvas height */
  yPct: number;
};

type NodeData = {
  base: THREE.Vector3;
  phase: number;
  speed: number;
  amp: number;
};

type Particle = {
  edgeIndex: number;
  t: number;
  speed: number;
};

function buildGraph(count: number) {
  const nodes: NodeData[] = [];
  // Fibonacci sphere → ellipsoid: fills a tall column (not a flat ring)
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const yUnit = 1 - 2 * t;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - yUnit * yUnit));
    const theta = golden * i + 0.42;
    const jitter = 0.1 * Math.sin(i * 2.7);
    const x = Math.cos(theta) * radiusAtY * (1 + jitter);
    const z = Math.sin(theta) * radiusAtY * (1 - jitter * 0.45);
    nodes.push({
      base: new THREE.Vector3(x * 1.7, yUnit * 1.95, z * 1.2),
      phase: i * 0.55,
      speed: 0.16 + (i % 4) * 0.035,
      amp: 0.03 + (i % 3) * 0.012,
    });
  }

  // k-nearest edges → denser neural-net look
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const link = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? `${a}:${b}` : `${b}:${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push([a, b]);
  };
  for (let i = 0; i < count; i++) {
    const ranked = nodes
      .map((n, j) => ({ j, d: n.base.distanceToSquared(nodes[i].base) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d);
    link(i, ranked[0].j);
    link(i, ranked[1].j);
    if (ranked[2]) link(i, ranked[2].j);
  }
  return { nodes, edges };
}

function canvasTexture(
  draw: (ctx: CanvasRenderingContext2D, size: number) => void,
  size = 128,
) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.premultiplyAlpha = false;
  return tex;
}

/** Solid bright dot — transaction pulse traveling on edges. */
function makePulseTexture() {
  return canvasTexture((ctx, size) => {
    const c = size / 2;
    const g = ctx.createRadialGradient(c, c, 0, c, c, c);
    g.addColorStop(0, "rgba(248,250,252,1)");
    g.addColorStop(0.2, "rgba(56,189,248,1)");
    g.addColorStop(0.55, "rgba(56,189,248,0.45)");
    g.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Rounded-square container — wallet / address node. */
function makeWalletTexture() {
  return canvasTexture((ctx, size) => {
    const c = size / 2;
    ctx.clearRect(0, 0, size, size);

    const box = size * 0.52;
    const x = c - box / 2;
    const y = c - box / 2;
    const radius = box * 0.22;

    // Soft outer glow (outside the solid body only)
    const glowPad = size * 0.1;
    const glow = ctx.createRadialGradient(c, c, box * 0.28, c, c, box * 0.7);
    glow.addColorStop(0, "rgba(56,189,248,0)");
    glow.addColorStop(0.5, "rgba(56,189,248,0.16)");
    glow.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = glow;
    roundRectPath(
      ctx,
      x - glowPad,
      y - glowPad,
      box + glowPad * 2,
      box + glowPad * 2,
      radius + glowPad * 0.45,
    );
    ctx.fill();

    // Opaque Void body — hides tx arrival flash behind the wallet
    ctx.fillStyle = "#070B14";
    roundRectPath(ctx, x, y, box, box, radius);
    ctx.fill();

    // Subtle opaque Surface wash (still solid, no see-through)
    const wash = ctx.createLinearGradient(x, y, x + box, y + box);
    wash.addColorStop(0, "#0F172A");
    wash.addColorStop(0.55, "#0B1220");
    wash.addColorStop(1, "#0F172A");
    ctx.fillStyle = wash;
    roundRectPath(ctx, x, y, box, box, radius);
    ctx.fill();

    // Border
    const stroke = ctx.createLinearGradient(x, y, x + box, y + box);
    stroke.addColorStop(0, "rgba(248,250,252,0.95)");
    stroke.addColorStop(0.45, "rgba(125,211,252,0.95)");
    stroke.addColorStop(1, "rgba(56,189,248,0.85)");
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(2, size * 0.045);
    roundRectPath(ctx, x, y, box, box, radius);
    ctx.stroke();
  });
}

/** Expanding ring flash on tx arrival — thick bright halo. */
function makeImpactRingTexture() {
  return canvasTexture((ctx, size) => {
    const c = size / 2;
    ctx.clearRect(0, 0, size, size);

    // Outer soft bloom
    const bloom = ctx.createRadialGradient(c, c, c * 0.2, c, c, c * 0.72);
    bloom.addColorStop(0, "rgba(56,189,248,0)");
    bloom.addColorStop(0.35, "rgba(56,189,248,0.55)");
    bloom.addColorStop(0.65, "rgba(125,211,252,0.35)");
    bloom.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(c, c, c * 0.72, 0, Math.PI * 2);
    ctx.fill();

    // Hot ring band
    const ring = ctx.createRadialGradient(c, c, c * 0.22, c, c, c * 0.48);
    ring.addColorStop(0, "rgba(248,250,252,0)");
    ring.addColorStop(0.35, "rgba(248,250,252,0.95)");
    ring.addColorStop(0.55, "rgba(56,189,248,1)");
    ring.addColorStop(0.8, "rgba(125,211,252,0.55)");
    ring.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(c, c, c * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Hollow center (wallet covers the middle)
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(c, c, c * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }, 160);
}

function createParticles(count: number, edgeCount: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    edgeIndex: edgeCount ? i % edgeCount : 0,
    t: (i / Math.max(count, 1)) % 1,
    speed: 0.07 + (i % 7) * 0.018,
  }));
}

function roundedRectShape(half: number, cornerR: number) {
  const r = Math.min(cornerR, half * 0.95);
  const shape = new THREE.Shape();
  const x = -half;
  const y = -half;
  const w = half * 2;
  const h = half * 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  return shape;
}

/** Filled stroke ring — reliable thickness (WebGL ignores LineBasic linewidth). */
function buildFrameRingGeometry(
  half: number,
  cornerR: number,
  stroke: number,
) {
  const outer = roundedRectShape(half, cornerR);
  const innerHalf = Math.max(half - stroke, half * 0.5);
  const innerR = cornerR * (innerHalf / half);
  const inner = roundedRectShape(innerHalf, innerR);
  outer.holes.push(inner);
  return new THREE.ShapeGeometry(outer, 24);
}

const FRAME_STROKE = 0.11;
const NETWORK_SPIN = 0.12;

export function GraphScene({
  nodeCount,
  particleCount,
  onTxArrive,
}: {
  nodeCount: number;
  particleCount: number;
  onTxArrive?: (payload: TxArrivePayload) => void;
}) {
  const { camera, size } = useThree();
  const { nodes, edges } = useMemo(() => buildGraph(nodeCount), [nodeCount]);
  const rootRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Group>(null);
  const networkRef = useRef<THREE.Group>(null);
  const positions = useRef(nodes.map((n) => n.base.clone()));
  const impact = useRef(new Float32Array(nodeCount));
  const onTxArriveRef = useRef(onTxArrive);
  const projectScratch = useRef(new THREE.Vector3());
  const fitScale = useRef(1);

  const cloudRadius = useMemo(() => {
    let max = 0;
    for (const n of nodes) max = Math.max(max, n.base.length());
    return max;
  }, [nodes]);

  const frameHalf = cloudRadius * 1.35;
  const frameCorner = frameHalf * 0.2;

  /** Framing uses half-diagonal of the larger observation square + pad. */
  const fitRadius = useMemo(() => {
    return frameHalf * Math.SQRT2 + 0.2;
  }, [frameHalf]);

  const frameRingGeo = useMemo(
    () => buildFrameRingGeometry(frameHalf, frameCorner, FRAME_STROKE),
    [frameHalf, frameCorner],
  );

  useEffect(() => {
    onTxArriveRef.current = onTxArrive;
  }, [onTxArrive]);

  // Soft editorial tilt on network axes X/Z only — Y is driven by spin
  useLayoutEffect(() => {
    if (networkRef.current) {
      networkRef.current.rotation.x = -0.12;
      networkRef.current.rotation.z = -0.04;
    }
  }, [nodes]);

  const nodePositions = useMemo(() => new Float32Array(nodeCount * 3), [nodeCount]);
  const linePositions = useMemo(
    () => new Float32Array(edges.length * 6),
    [edges.length],
  );
  const particlePositions = useMemo(
    () => new Float32Array(Math.max(particleCount, 1) * 3),
    [particleCount],
  );
  const flashPositions = useMemo(
    () => new Float32Array(nodeCount * 3),
    [nodeCount],
  );
  const flashImpacts = useRef(new Float32Array(nodeCount));
  const elapsed = useRef(0);
  const nodePositionsRef = useRef(nodePositions);
  const linePositionsRef = useRef(linePositions);
  const particlePositionsRef = useRef(particlePositions);
  const flashPositionsRef = useRef(flashPositions);

  const particles = useRef<Particle[]>(
    createParticles(particleCount, edges.length),
  );

  useLayoutEffect(() => {
    nodePositionsRef.current = nodePositions;
    linePositionsRef.current = linePositions;
    particlePositionsRef.current = particlePositions;
    flashPositionsRef.current = flashPositions;
  }, [nodePositions, linePositions, particlePositions, flashPositions]);

  useEffect(() => {
    positions.current = nodes.map((n) => n.base.clone());
    impact.current = new Float32Array(nodeCount);
    particles.current = createParticles(particleCount, edges.length);
    flashImpacts.current = new Float32Array(nodeCount);
  }, [nodes, nodeCount, particleCount, edges.length]);

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const particleRef = useRef<THREE.Points>(null);
  const flashRef = useRef<THREE.Points>(null);
  const frameMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameHitRef = useRef(0);

  const pulseTexture = useMemo(() => makePulseTexture(), []);
  const walletTexture = useMemo(() => makeWalletTexture(), []);
  const impactTexture = useMemo(() => makeImpactRingTexture(), []);

  useFrame((_state, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;
    const edgeCount = edges.length;
    const nodePos = nodePositionsRef.current;
    const linePos = linePositionsRef.current;
    const particlePos = particlePositionsRef.current;
    const flashPos = flashPositionsRef.current;

    // Fit scale for network (world) + frame (screen-locked)
    {
      const cam = camera as THREE.PerspectiveCamera;
      const dist = Math.max(camera.position.length(), 0.1);
      const vFov = THREE.MathUtils.degToRad(cam.fov);
      const visibleH = 2 * Math.tan(vFov / 2) * dist;
      const visibleW = visibleH * (size.width / Math.max(size.height, 1));
      const avail = Math.min(visibleW, visibleH) * 0.97;
      const s = avail / (2 * fitRadius);
      fitScale.current = s;
      if (rootRef.current) rootRef.current.scale.setScalar(s);
      if (frameRef.current) {
        // Lock frame to camera orientation so the square stays screen-fixed
        // while OrbitControls only tumbles the network in world space
        frameRef.current.quaternion.copy(camera.quaternion);
        frameRef.current.scale.setScalar(s);
      }
    }

    // Network spins in world space
    if (networkRef.current) {
      networkRef.current.rotation.y += delta * NETWORK_SPIN;
    }

    // Frame border: soft ambient beat + strong flash on tx arrival
    if (frameMatRef.current) {
      frameHitRef.current *= 0.86;
      const beat = t * 1.15;
      const lub = Math.pow(Math.max(0, Math.sin(beat * Math.PI * 2)), 12);
      const dub = Math.pow(Math.max(0, Math.sin((beat - 0.18) * Math.PI * 2)), 16);
      const ambient = 0.22 + lub * 0.12 + dub * 0.08;
      frameMatRef.current.opacity = ambient + frameHitRef.current * 0.55;
    }

    nodes.forEach((node, i) => {
      const p = positions.current[i];
      p.x = node.base.x + Math.sin(t * node.speed + node.phase) * node.amp;
      p.y =
        node.base.y + Math.cos(t * node.speed * 0.75 + node.phase) * node.amp * 0.65;
      p.z =
        node.base.z +
        Math.sin(t * node.speed * 0.5 + node.phase * 0.4) * node.amp * 0.45;
      nodePos[i * 3] = p.x;
      nodePos[i * 3 + 1] = p.y;
      nodePos[i * 3 + 2] = p.z;
      impact.current[i] *= 0.88;
    });

    edges.forEach(([a, b], i) => {
      const pa = positions.current[a];
      const pb = positions.current[b];
      const o = i * 6;
      linePos[o] = pa.x;
      linePos[o + 1] = pa.y;
      linePos[o + 2] = pa.z;
      linePos[o + 3] = pb.x;
      linePos[o + 4] = pb.y;
      linePos[o + 5] = pb.z;
    });

    if (edgeCount > 0) {
      particles.current.forEach((part, i) => {
        part.t += part.speed * 0.01;
        if (part.t >= 1) {
          const dest = edges[part.edgeIndex % edgeCount][1];
          impact.current[dest] = 1;
          frameHitRef.current = 1;

          if (onTxArriveRef.current && networkRef.current) {
            const world = projectScratch.current.copy(positions.current[dest]);
            networkRef.current.localToWorld(world);
            world.project(camera);
            if (world.z < 1) {
              const xPct = (world.x * 0.5 + 0.5) * 100;
              const yPct = (-world.y * 0.5 + 0.5) * 100;
              // Canvas is the right column — keep labels inside with padding
              if (xPct >= 4 && xPct <= 96 && yPct >= 6 && yPct <= 92) {
                onTxArriveRef.current({ xPct, yPct });
              }
            }
          }

          part.t = 0;
          part.edgeIndex = Math.floor(Math.random() * edgeCount);
          part.speed = 0.06 + Math.random() * 0.1;
        }
        const [a, b] = edges[part.edgeIndex % edgeCount];
        const pa = positions.current[a];
        const pb = positions.current[b];
        particlePos[i * 3] = pa.x + (pb.x - pa.x) * part.t;
        particlePos[i * 3 + 1] = pa.y + (pb.y - pa.y) * part.t;
        particlePos[i * 3 + 2] = pa.z + (pb.z - pa.z) * part.t;
      });
    }

    let flashes = 0;
    let peakImpact = 0;
    for (let i = 0; i < nodeCount; i++) {
      const imp = impact.current[i];
      if (imp > 0.04) {
        const p = positions.current[i];
        flashPos[flashes * 3] = p.x;
        flashPos[flashes * 3 + 1] = p.y;
        flashPos[flashes * 3 + 2] = p.z;
        flashImpacts.current[flashes] = imp;
        peakImpact = Math.max(peakImpact, imp);
        flashes += 1;
      }
    }

    const nodeAttr = pointsRef.current?.geometry.getAttribute("position") as
      | THREE.BufferAttribute
      | undefined;
    if (nodeAttr) nodeAttr.needsUpdate = true;

    const lineAttr = linesRef.current?.geometry.getAttribute("position") as
      | THREE.BufferAttribute
      | undefined;
    if (lineAttr) lineAttr.needsUpdate = true;

    const particleAttr = particleRef.current?.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute | undefined;
    if (particleAttr) particleAttr.needsUpdate = true;

    const flashGeom = flashRef.current?.geometry;
    if (flashGeom) {
      const flashAttr = flashGeom.getAttribute("position") as THREE.BufferAttribute;
      flashAttr.needsUpdate = true;
      flashGeom.setDrawRange(0, flashes);
      const mat = flashRef.current?.material as THREE.PointsMaterial | undefined;
      if (mat) {
        // Bright burst that expands as impact decays
        // Compensate PointsMaterial.size (ignores parent scale)
        const s = fitScale.current;
        mat.opacity = 0.45 + peakImpact * 0.55;
        mat.size = (0.65 + (1 - peakImpact) * 0.55) * s;
      }
    }

    const s = fitScale.current;
    const walletMat = pointsRef.current?.material as
      | THREE.PointsMaterial
      | undefined;
    if (walletMat) walletMat.size = 0.4 * s;
    const pulseMat = particleRef.current?.material as
      | THREE.PointsMaterial
      | undefined;
    if (pulseMat) pulseMat.size = 0.12 * s;
  });

  return (
    <>
      {/* Observation frame — always faces camera (screen-fixed square) */}
      <group ref={frameRef}>
        <mesh geometry={frameRingGeo} renderOrder={-1}>
          <meshBasicMaterial
            ref={frameMatRef}
            color="#38BDF8"
            transparent
            opacity={0.42}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Wallet / tx network — world space (orbits with camera + auto-spin) */}
      <group ref={rootRef}>
        <group ref={networkRef}>
          <lineSegments ref={linesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[linePositions, 3]}
                count={edges.length * 2}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#38BDF8" transparent opacity={0.36} />
          </lineSegments>

          {particleCount > 0 ? (
            <points ref={particleRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[particlePositions, 3]}
                  count={particleCount}
                />
              </bufferGeometry>
              <pointsMaterial
                map={pulseTexture ?? undefined}
                color="#38BDF8"
                size={0.1}
                sizeAttenuation
                transparent
                opacity={0.98}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </points>
          ) : null}

          <points ref={flashRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[flashPositions, 3]}
                count={nodeCount}
              />
            </bufferGeometry>
            <pointsMaterial
              map={impactTexture ?? undefined}
              color="#7DD3FC"
              size={0.7}
              sizeAttenuation
              transparent
              opacity={0.95}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>

          <points ref={pointsRef} renderOrder={2}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[nodePositions, 3]}
                count={nodeCount}
              />
            </bufferGeometry>
            <pointsMaterial
              map={walletTexture ?? undefined}
              color="#FFFFFF"
              size={0.4}
              sizeAttenuation
              transparent
              opacity={1}
              depthWrite
              depthTest
              blending={THREE.NormalBlending}
              alphaTest={0.15}
            />
          </points>
        </group>
      </group>
    </>
  );
}
