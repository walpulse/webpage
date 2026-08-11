"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import { GraphScene, type TxArrivePayload } from "./GraphScene";
import { randomTxAmount } from "./txAmounts";
import { TxLabels, type TxLabelItem } from "./TxLabels";

const MAX_LABELS = 6;
const LABEL_TTL_MS = 1100;
const MIN_GAP_MS = 200;

function VisibilityPause() {
  const { invalidate, setFrameloop } = useThree();

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setFrameloop("never");
      } else {
        setFrameloop("always");
        invalidate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [invalidate, setFrameloop]);

  return null;
}

export function SignalGraph() {
  const [nodeCount, setNodeCount] = useState(36);
  const [particleCount, setParticleCount] = useState(30);
  const [labels, setLabels] = useState<TxLabelItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const nextId = useRef(0);
  const lastEmit = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => {
      const mobile = mq.matches;
      setNodeCount(mobile ? 20 : 36);
      setParticleCount(mobile ? 18 : 30);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onTxArrive = useCallback((payload: TxArrivePayload) => {
    const now = performance.now();
    if (now - lastEmit.current < MIN_GAP_MS) return;
    lastEmit.current = now;

    const amount = randomTxAmount();
    const id = ++nextId.current;
    const item: TxLabelItem = {
      id,
      x: payload.xPct,
      y: payload.yPct,
      text: amount.text,
      positive: amount.positive,
    };

    setLabels((prev) => [...prev.slice(-(MAX_LABELS - 1)), item]);
    window.setTimeout(() => {
      setLabels((prev) => prev.filter((l) => l.id !== id));
    }, LABEL_TTL_MS);
  }, []);

  return (
    <div
      className="relative h-full w-full"
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [1.6, 1.1, 4.6], fov: 40, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
      >
        <fog attach="fog" args={["#070B14", 4.2, 12]} />
        <ambientLight intensity={0.28} />
        <directionalLight
          position={[3.5, 4, 2.5]}
          intensity={0.6}
          color="#7DD3FC"
        />
        <VisibilityPause />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enableRotate
          enableZoom={false}
          enablePan={false}
          target={[0, 0, 0]}
          minPolarAngle={Math.PI * 0.32}
          maxPolarAngle={Math.PI * 0.62}
          onStart={() => setDragging(true)}
          onEnd={() => setDragging(false)}
        />
        <GraphScene
          nodeCount={nodeCount}
          particleCount={particleCount}
          onTxArrive={onTxArrive}
        />
      </Canvas>
      <TxLabels labels={labels} />
    </div>
  );
}
