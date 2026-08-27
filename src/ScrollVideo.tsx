import { useEffect, useRef, useCallback, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  const framesRef = useRef<ImageBitmap[]>([]);
  const framesReady = useRef(false);
  const smoothed = useRef(0);
  const lastSeek = useRef(0);
  const durationRef = useRef(0);
  const targetProgress = useRef(0);

  // Cached canvas dimensions to avoid layout thrashing
  const cachedDims = useRef({ w: 0, h: 0, dpr: 1 });

  const [posterVisible, setPosterVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(false);

  // Calculate scroll progress accurately across mobile and desktop
  const updateScrollProgress = useCallback(() => {
    const scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
    const innerH = window.innerHeight || document.documentElement.clientHeight;
    if (scrollH <= innerH) {
      targetProgress.current = 0;
      return;
    }
    const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = Math.min(1, Math.max(0, currentY / (scrollH - innerH)));
    targetProgress.current = progress;
  }, []);

  // Draw a frame on canvas with object-cover math and cached dimensions
  const drawFrame = useCallback(
    (source: ImageBitmap | HTMLVideoElement | HTMLCanvasElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true }) || canvas.getContext('2d');
      if (!ctx) return;

      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const targetW = Math.round(cw * dpr);
      const targetH = Math.round(ch * dpr);

      // Only resize canvas backing buffer when dimensions genuinely change
      if (cachedDims.current.w !== targetW || cachedDims.current.h !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
        cachedDims.current = { w: targetW, h: targetH, dpr };
      }

      const sw = source instanceof ImageBitmap ? source.width : (source as HTMLVideoElement).videoWidth || cw;
      const sh = source instanceof ImageBitmap ? source.height : (source as HTMLVideoElement).videoHeight || ch;

      if (!sw || !sh) return;

      // Object-cover: scale to fill viewport, center crop
      const scale = Math.max(targetW / sw, targetH / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (targetW - dw) / 2;
      const dy = (targetH - dh) / 2;

      ctx.drawImage(source, dx, dy, dw, dh);
    },
    []
  );

  // Extract frames adaptively for mobile (lighter & faster) and desktop (full fidelity)
  const extractFrames = useCallback(async () => {
    try {
      const isMobile = window.innerWidth < 768;
      // Mobile: 45 frames @ 480px width (ultra fast ~200ms load, ~80% memory reduction)
      // Desktop: 75 frames @ 960px width
      const maxFrames = isMobile ? 45 : 75;
      const maxWidth = isMobile ? 480 : 960;

      const offscreen = document.createElement('video');
      offscreen.src = VIDEO_URL;
      offscreen.muted = true;
      offscreen.setAttribute('muted', 'true');
      offscreen.setAttribute('playsinline', 'true');
      offscreen.setAttribute('webkit-playsinline', 'true');
      offscreen.preload = 'auto';

      await new Promise<void>((resolve) => {
        offscreen.addEventListener('loadeddata', () => resolve(), { once: true });
        offscreen.load();
      });

      const dur = offscreen.duration || 5;
      durationRef.current = dur;
      const frameCount = Math.min(maxFrames, Math.max(20, Math.floor(dur * (isMobile ? 10 : 16))));
      const frames: ImageBitmap[] = [];

      const vw = offscreen.videoWidth || 1280;
      const vh = offscreen.videoHeight || 720;
      const scale = Math.min(1, maxWidth / vw);
      const tw = Math.round(vw * scale);
      const th = Math.round(vh * scale);

      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = tw;
      tmpCanvas.height = th;
      const tmpCtx = tmpCanvas.getContext('2d', { willReadFrequently: true })!;

      for (let i = 0; i < frameCount; i++) {
        const time = (i / (frameCount - 1)) * (dur - 0.05);
        offscreen.currentTime = time;
        await new Promise<void>((resolve) => {
          offscreen.addEventListener('seeked', () => resolve(), { once: true });
        });
        tmpCtx.drawImage(offscreen, 0, 0, tw, th);
        if ('createImageBitmap' in window) {
          const bmp = await createImageBitmap(tmpCanvas);
          frames.push(bmp);
        }
      }

      if (frames.length > 0) {
        framesRef.current = frames;
        framesReady.current = true;
        setCanvasVisible(true);
        setPosterVisible(false);
        setVideoVisible(false);
      }
    } catch (e) {
      console.warn('Offscreen frame extraction fallback to direct video scrubbing:', e);
      setVideoVisible(true);
      setPosterVisible(false);
    }
  }, []);

  // High-performance RAF scroll animation loop
  useEffect(() => {
    let running = true;
    updateScrollProgress();

    const loop = () => {
      if (!running) return;

      const target = targetProgress.current;
      // Responsive lerp: fast response to finger touch scroll
      const lerpSpeed = 0.16;
      smoothed.current += (target - smoothed.current) * lerpSpeed;

      if (framesReady.current && framesRef.current.length > 0) {
        const idx = Math.min(
          framesRef.current.length - 1,
          Math.max(0, Math.round(smoothed.current * (framesRef.current.length - 1)))
        );
        drawFrame(framesRef.current[idx]);
      } else if (videoRef.current && durationRef.current > 0) {
        // Fallback: direct video scrub
        const seekTime = smoothed.current * (durationRef.current - 0.05);
        if (Math.abs(seekTime - lastSeek.current) > 0.03) {
          videoRef.current.currentTime = Math.max(0, seekTime);
          lastSeek.current = seekTime;
        }
      }

      requestAnimationFrame(loop);
    };

    const animId = requestAnimationFrame(loop);

    // Passive scroll listener for instant touch reaction on mobile
    const handleScroll = () => {
      updateScrollProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
    };
  }, [updateScrollProgress, drawFrame]);

  // Load video and initialize frame engine
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      durationRef.current = video.duration || 5;
      setVideoVisible(true);
      setPosterVisible(false);

      // Rapid initialization
      const timer = setTimeout(() => {
        extractFrames();
      }, 150);

      return () => clearTimeout(timer);
    };

    video.addEventListener('loadeddata', onLoaded, { once: true });
    video.load();

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [extractFrames]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      updateScrollProgress();
      if (framesReady.current && framesRef.current.length > 0) {
        const idx = Math.min(
          framesRef.current.length - 1,
          Math.max(0, Math.round(smoothed.current * (framesRef.current.length - 1)))
        );
        drawFrame(framesRef.current[idx]);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [drawFrame, updateScrollProgress]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#080808] pointer-events-none transform-gpu">
      {/* Layer 1: Poster */}
      <img
        ref={posterRef}
        src="/figma/portfolio-hero-cover.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: posterVisible ? 1 : 0 }}
      />

      {/* Layer 2: Video (hardware-accelerated fallback seek for mobile & desktop) */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
        webkit-playsinline="true"
        x5-video-player-type="h5"
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: videoVisible && !canvasVisible ? 1 : 0 }}
      />

      {/* Layer 3: Canvas (60 FPS scroll-scrubbed frames) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-700"
        style={{ opacity: canvasVisible ? 1 : 0 }}
      />

      {/* Subtle Dark Vignette & Mesh Overlay for optimal contrast on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/70 via-transparent to-[#080808]/85 pointer-events-none" />
    </div>
  );
}

