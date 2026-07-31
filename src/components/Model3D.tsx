"use client";

import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import Script from "next/script";

interface Model3DProps {
  src: string;
  poster?: string;
  alt: string;
  loading?: 'auto' | 'lazy' | 'eager';
  cameraOrbit?: string;
}

const Model3D = forwardRef<HTMLElement, Model3DProps>(({ src, poster, alt, loading = "eager", cameraOrbit }, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const internalRef = useRef<HTMLElement>(null);

  useImperativeHandle(ref, () => internalRef.current!);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full relative flex items-center justify-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl animate-pulse">
        <span className="sr-only">Loading 3D Model...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        type="module"
        strategy="afterInteractive"
      />
      {/* @ts-ignore */}
      <model-viewer
        ref={internalRef}
        src={src}
        poster={poster}
        alt={alt}
        loading={loading}
        camera-controls
        disable-zoom
        auto-rotate
        camera-orbit={cameraOrbit}
        rotation-per-second="30deg"
        interaction-prompt="none"
        shadow-intensity="1"
        exposure="1.1"
        environment-image="neutral"
        ar
        ar-modes="webxr scene-viewer quick-look"
        style={{ width: "100%", height: "100%", background: "transparent", "--poster-color": "transparent" } as React.CSSProperties}
        onLoad={() => setIsLoading(false)}
      >
        {/* Hide default model-viewer progress bar / spinner slot */}
        <div slot="progress-bar" style={{ display: "none" }}></div>
        {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
});

Model3D.displayName = "Model3D";

export default Model3D;