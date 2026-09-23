import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './KitchenStory.css';

gsap.registerPlugin(ScrollTrigger);

const ROOT = import.meta.env.BASE_URL + 'kitchen-scroll/';
const CONFIG = {
  desktop: { count: 84, scrollScreens: 3.8, preloadWorkers: 8 },
  mobile: { count: 72, scrollScreens: 2.6, preloadWorkers: 5 },
} as const;
type Variant = keyof typeof CONFIG;
type Status = 'loading' | 'ready' | 'static';

function getPreferences() {
  return {
    variant: window.matchMedia('(max-width: 767px)').matches ? 'mobile' as Variant : 'desktop' as Variant,
    staticRequested: window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  };
}
function frameUrl(variant: Variant, frame: number) {
  return ROOT + variant + '/frame' + String(frame + 1).padStart(3, '0') + '.webp';
}

export default function KitchenStory({ onExplore }: { onExplore: () => void }) {
  const outer = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [preferences, setPreferences] = useState(getPreferences);
  const [status, setStatus] = useState<Status>('loading');
  const [loaded, setLoaded] = useState(0);
  const [phase, setPhase] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const width = matchMedia('(max-width: 767px)');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPreferences(getPreferences());
    width.addEventListener('change', update);
    motion.addEventListener('change', update);
    return () => {
      width.removeEventListener('change', update);
      motion.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (preferences.staticRequested) {
      setStatus('static');
      setLoaded(100);
      return;
    }

    const section = outer.current;
    const surface = scene.current;
    const element = canvas.current;
    const context = element?.getContext('2d', { alpha: false });
    if (!section || !surface || !element || !context) return;

    const config = CONFIG[preferences.variant];
    const images: HTMLImageElement[] = new Array(config.count);
    let disposed = false;
    let raf = 0;
    let lastFrame = -1;
    let currentProgress = 0;
    let trigger: ScrollTrigger | undefined;

    setStatus('loading');
    setLoaded(0);
    setPhase(0);
    setScrollPercent(0);

    const draw = (index: number) => {
      if (disposed) return;
      const picture = images[index];
      if (!picture?.naturalWidth) return;
      const rect = surface.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (element.width !== Math.round(w * ratio) || element.height !== Math.round(h * ratio)) {
        element.width = Math.round(w * ratio);
        element.height = Math.round(h * ratio);
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.fillStyle = '#31271f';
      context.fillRect(0, 0, w, h);
      const scale = Math.max(w / picture.naturalWidth, h / picture.naturalHeight);
      const width = picture.naturalWidth * scale;
      const height = picture.naturalHeight * scale;
      context.drawImage(picture, (w - width) / 2, (h - height) / 2, width, height);
      lastFrame = index;
    };

    const scheduleDraw = (force = false) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const index = Math.min(config.count - 1, Math.round(currentProgress * (config.count - 1)));
        if (force || index !== lastFrame) draw(index);
      });
    };

    const load = async () => {
      let next = 0;
      let complete = 0;
      const worker = async () => {
        while (next < config.count && !disposed) {
          const index = next++;
          const picture = new Image();
          picture.decoding = 'async';
          images[index] = picture;
          await new Promise<void>((resolve, reject) => {
            picture.onload = () => resolve();
            picture.onerror = () => reject(new Error('Kitchen animation missing ' + frameUrl(preferences.variant, index)));
            picture.src = frameUrl(preferences.variant, index);
          });
          complete++;
          if (!disposed && (complete % 6 === 0 || complete === config.count)) {
            setLoaded(Math.round(complete * 100 / config.count));
          }
        }
      };
      await Promise.all(Array.from({ length: config.preloadWorkers }, worker));
    };

    load().then(() => {
      if (disposed) return;
      scheduleDraw(true);
      setStatus('ready');
      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => '+=' + Math.round(window.innerHeight * config.scrollScreens),
        pin: surface,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (instance) => {
          currentProgress = instance.progress;
          setScrollPercent(Math.round(instance.progress * 100));
          const chapter = currentProgress < .34 ? 0 : currentProgress < .78 ? 1 : 2;
          setPhase(previous => previous === chapter ? previous : chapter);
          scheduleDraw();
        }
      });
      window.addEventListener('resize', onResize);
      ScrollTrigger.refresh();
    }).catch((error) => {
      if (disposed) return;
      console.warn('CookSmart animation fallback:', error);
      setStatus('static');
    });

    function onResize() { scheduleDraw(true); }

    return () => {
      disposed = true;
      trigger?.kill();
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [preferences.variant, preferences.staticRequested]);

  const poster = ROOT + preferences.variant + '/poster.webp';
  return (
    <section ref={outer} id="home" className="kitchen-cinema"
      data-mode={status} data-phase={phase} data-variant={preferences.variant}
      aria-label="CookSmart kitchen cinematic scroll experience">
      <div ref={scene} className="kitchen-cinema-stage">
        <img className="cinema-poster" src={poster}
          alt="Apple pie ingredients transforming into a finished pie" />
        <canvas className="cinema-canvas" ref={canvas} aria-hidden="true" />
        <div className="cinema-shade" aria-hidden="true" />
        <div className="cinema-top">
          <span>COOKSMART / EXPERIENCE 002</span><span>FROM INGREDIENTS TO PIE</span>
        </div>
        <div className="cinema-copy">
          <div className="cinema-chapter chapter-one"
            aria-hidden={status === 'ready' && phase !== 0}>
            <p className="cinema-eyebrow">01 / INGREDIENTS</p>
            <h1>Start with<br /><em>something simple.</em></h1>
            <p>Apples, spice, pastry — waiting to become something special.</p>
            <small>SCROLL TO EXPLORE ↓</small>
          </div>
          <div className="cinema-chapter chapter-two"
            aria-hidden={status !== 'ready' || phase !== 1}>
            <p className="cinema-eyebrow">02 / TRANSFORM</p>
            <h2>Watch it<br /><em>come together.</em></h2>
            <p>Scroll through the transformation from ingredients to a finished pie.</p>
          </div>
          <div className="cinema-chapter chapter-three"
            aria-hidden={status !== 'ready' || phase !== 2}>
            <p className="cinema-eyebrow">03 / TASTE</p>
            <h2>Made to<br /><em>be shared.</em></h2>
            <p>One recipe, one transformation, one warm slice at a time.</p>
            <button type="button" className="cinema-cta" onClick={onExplore}>
              Explore the recipes ↗
            </button>
          </div>
        </div>
        {status === 'loading' && <p role="status" className="cinema-status">
          PREPARING YOUR EXPERIENCE — {loaded}%
        </p>}
        {status === 'ready' && <div className="cinema-progress" aria-hidden="true">
          <i style={{ width: scrollPercent + '%' }} />
        </div>}
        {status === 'static' && <button type="button" className="cinema-mobile-cta"
          onClick={onExplore}>Explore the recipes ↗</button>}
      </div>
    </section>
  );
}
