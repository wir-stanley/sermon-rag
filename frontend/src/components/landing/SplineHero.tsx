"use client";

import React, { lazy, Suspense, useState } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

function GradientFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-900/20 via-transparent to-transparent" />
    </div>
  );
}

export default function SplineHero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <GradientFallback />
      <Suspense fallback={null}>
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <Spline
            scene="https://prod.spline.design/LJh6RODuYrhdQqce/scene.splinecode"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Suspense>
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
