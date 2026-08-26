import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface WebGLLiquidSurgeButtonProps {
  label?: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  className?: string;
}

export default function WebGLLiquidSurgeButton({
  label = 'SURGE',
  onClick,
  width = 'w-[260px]',
  height = 'h-[72px]',
  className = '',
}: WebGLLiquidSurgeButtonProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time, u_level, u_tilt, u_slosh;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
      float noise(vec2 p){
          vec2 i=floor(p), f=fract(p);
          vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);
      }
      float fbm(vec2 p){
          float v=0.0; float a=0.5;
          for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.04+vec2(11.3,7.1); a*=0.5; }
          return v;
      }
      void main(){
          vec2 uv = gl_FragCoord.xy / u_res;
          float x = uv.x * (u_res.x / u_res.y);
          float t = u_time;
          float amp = 0.012 + u_slosh * 0.045;
          float surf = u_level + u_tilt * (uv.x - 0.5) * 0.34 + amp * sin(x * 5.1 + t * 4.6) + amp * 0.62 * sin(x * 9.7 - t * 6.8 + 1.7);
          float d = surf - uv.y;
          vec3 col = mix(vec3(0.03, 0.06, 0.1), vec3(0.05, 0.09, 0.15), uv.y);
          float inside = smoothstep(0.0, 0.012, d);
          vec3 liq = mix(vec3(0.0, 0.9, 1.0), vec3(0.02, 0.15, 0.45), clamp(d/max(u_level,0.001),0.0,1.0));
          liq *= 0.8 + 0.42 * fbm(vec2(x * 4.2, (uv.y + t * 0.14) * 4.2));
          col = mix(col, liq, inside);
          col += vec3(0.4, 0.9, 1.0) * exp(-abs(d) * 80.0) * 0.85;
          vec2 e = uv * (1.0 - uv);
          col *= 0.55 + 0.45 * pow(e.x * e.y * 16.0, 0.22);
          gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, src: string) {
      const s = glCtx.createShader(type);
      if (!s) return null;
      glCtx.shaderSource(s, src);
      glCtx.compileShader(s);
      return s;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const locP = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uLevel = gl.getUniformLocation(prog, 'u_level');
    const uTilt = gl.getUniformLocation(prog, 'u_tilt');
    const uSlosh = gl.getUniformLocation(prog, 'u_slosh');

    let level = 0.56, gulp = 0, slosh = 0.4, tilt = 0, tiltT = 0, lastX: number | null = null, last = 0;
    let animId: number;

    function resize() {
      if (!canvas || !btn || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(btn.clientWidth * dpr);
      const h = Math.floor(btn.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      if (lastX !== null) slosh = Math.min(1.4, slosh + Math.abs(x - lastX) * 2.6);
      lastX = x;
      tiltT = (x - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      lastX = null;
      tiltT = 0;
    };

    const handleClick = () => {
      gulp = 1;
      slosh = Math.min(1.4, slosh + 0.7);
      if (onClick) onClick();
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    btn.addEventListener('click', handleClick);

    function render(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      slosh *= Math.exp(-1.5 * dt);
      gulp *= Math.exp(-1.1 * dt);
      tilt += (tiltT - tilt) * Math.min(1, dt * 5);
      level += (0.56 - 0.36 * gulp - level) * Math.min(1, dt * 5.5);

      resize();
      if (gl) {
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, now / 1000);
        gl.uniform1f(uLevel, level);
        gl.uniform1f(uTilt, tilt);
        gl.uniform1f(uSlosh, slosh);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      animId = requestAnimationFrame(render);
    }
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
      btn.removeEventListener('click', handleClick);
    };
  }, [onClick]);

  return (
    <div className={`relative group inline-block ${className}`}>
      <div className="p-[1px] rounded-[20px] bg-gradient-to-b from-cyan-400/40 via-cyan-900/20 to-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)]">
        <button
          ref={buttonRef}
          type="button"
          className={`relative flex items-center justify-center ${width} ${height} border-0 p-0 rounded-[19px] overflow-hidden cursor-pointer bg-[#050b11] transition-all duration-300 ease-out active:translate-y-[1px] active:scale-[0.985] shadow-[0_22px_44px_rgba(4,24,36,0.35),0_3px_9px_rgba(5,10,15,0.4),inset_0_0_0_1px_rgba(255,255,255,0.1)]`}
        >
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block" />
          <span className="relative z-10 pointer-events-none font-sans font-medium text-xs sm:text-sm tracking-[0.3em] indent-[0.3em] text-[#e0faff] flex items-center gap-2 drop-shadow-[0_1px_10px_rgba(0,18,25,0.85)] uppercase">
            {label}
            <ArrowRight className="w-4 h-4 text-cyan-300 ml-1 opacity-90 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
}
