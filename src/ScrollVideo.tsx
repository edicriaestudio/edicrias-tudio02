import { useEffect, useRef, useCallback, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';

const MAX_FRAMES = 90;
const MAX_WIDTH = 960;

export default function ScrollVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);

  const framesRef = useRef<ImageBitmap[]>([]);
  const framesReady = useRef(false);
  const smoothed = useRef(0);
  const lastSeek = useRef(0);
  const durationRef = useRef(0);

  const [posterVisible, setPosterVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(false);

  // Get scroll progress
  const getProgress = useCallback(() => {
    const scrollH = document.documentElement.scrollHeight;
    const innerH = window.innerHeight;
    if (scrollH <= innerH) return 0;
    return Math.min(1, Math.max(0, window.scrollY / (scrollH - innerH)));
  }, []);

  // Draw a frame on canvas with object-cover math
  const drawFrame = useCallback(
    (source: ImageBitmap | HTMLVideoElement | HTMLCanvasElement) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio, 2);
      const cw = window.innerWidth;
      const ch = window.innerHeight;

      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width = `${cw}px`;
        canvas.style.height = `${ch}px`;
      }

      const sw = source instanceof ImageBitmap ? source.width : (source as HTMLVideoElement).videoWidth || cw;
      const sh = source instanceof ImageBitmap ? source.height : (source as HTMLVideoElement).videoHeight || ch;

      // object-cover: scale to fill, center crop
      const scale = Math.max((cw * dpr) / sw, (ch * dpr) / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      const dx = (cw * dpr - dw) / 2;
      const dy = (ch * dpr - dh) / 2;

      ctx.clearRect(0, 0, cw * dpr, ch * dpr);
      ctx.drawImage(source, dx, dy, dw, dh);
    },
    []
  );

  // Extract frames from offscreen video
  const extractFrames = useCallback(async () => {
    const offscreen = document.createElement('video');
    offscreen.src = VIDEO_URL;
    offscreen.muted = true;
    offscreen.preload = 'auto';
    offscreen.playsInline = true;

    await new Promise<void>((resolve) => {
      offscreen.addEventListener('loadeddata', () => resolve(), { once: true });
      offscreen.load();
    });

    const dur = offscreen.duration;
    durationRef.current = dur;
    const frameCount = Math.min(MAX_FRAMES, Math.max(24, Math.floor(dur * 12)));
    const frames: ImageBitmap[] = [];

    // Scale down for perf
    const vw = offscreen.videoWidth;
    const vh = offscreen.videoHeight;
    const scale = Math.min(1, MAX_WIDTH / vw);
    const tw = Math.round(vw * scale);
    const th = Math.round(vh * scale);

    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = tw;
    tmpCanvas.height = th;
    const tmpCtx = tmpCanvas.getContext('2d')!;

    for (let i = 0; i < frameCount; i++) {
      const time = (i / (frameCount - 1)) * (dur - 0.05);
      offscreen.currentTime = time;
      await new Promise<void>((resolve) => {
        offscreen.addEventListener('seeked', () => resolve(), { once: true });
      });
      tmpCtx.clearRect(0, 0, tw, th);
      tmpCtx.drawImage(offscreen, 0, 0, tw, th);
      const bmp = await createImageBitmap(tmpCanvas);
      frames.push(bmp);
    }

    framesRef.current = frames;
    framesReady.current = true;
    setCanvasVisible(true);
    setPosterVisible(false);
    setVideoVisible(false);
  }, []);

  // Animate loop
  useEffect(() => {
    let running = true;

    const loop = () => {
      if (!running) return;
      const target = getProgress();
      smoothed.current += (target - smoothed.current) * 0.12;

      if (framesReady.current && framesRef.current.length > 0) {
        const idx = Math.min(
          framesRef.current.length - 1,
          Math.round(smoothed.current * (framesRef.current.length - 1))
        );
        drawFrame(framesRef.current[idx]);
      } else if (videoRef.current && durationRef.current > 0) {
        // Fallback: seek video
        const seekTime = smoothed.current * (durationRef.current - 0.05);
        if (Math.abs(seekTime - lastSeek.current) > 0.04) {
          videoRef.current.currentTime = seekTime;
          lastSeek.current = seekTime;
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => {
      running = false;
    };
  }, [getProgress, drawFrame]);

  // Init: load video, wait, then extract
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoaded = () => {
      durationRef.current = video.duration;
      setVideoVisible(true);
      setPosterVisible(false);

      // Wait 300ms then start frame extraction
      setTimeout(() => {
        extractFrames();
      }, 300);
    };

    video.addEventListener('loadeddata', onLoaded, { once: true });
    video.load();

    return () => {
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [extractFrames]);

  // Handle resize for canvas
  useEffect(() => {
    const handleResize = () => {
      if (framesReady.current && framesRef.current.length > 0) {
        const idx = Math.min(
          framesRef.current.length - 1,
          Math.round(smoothed.current * (framesRef.current.length - 1))
        );
        drawFrame(framesRef.current[idx]);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0a0a] pointer-events-none">
      {/* Layer 1: Poster */}
      <img
        ref={posterRef}
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: posterVisible ? 1 : 0 }}
        onError={(e) => {
          // If poster doesn't exist, just hide it
          (e.target as HTMLImageElement).style.opacity = '0';
        }}
      />

      {/* Layer 2: Video (fallback seek) */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
        style={{ opacity: videoVisible && !canvasVisible ? 1 : 0 }}
      />

      {/* Layer 3: Canvas (scrubbed frames) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: canvasVisible ? 1 : 0 }}
      />
    </div>
  );
}
