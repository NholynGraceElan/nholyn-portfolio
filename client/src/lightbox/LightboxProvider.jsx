import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const LightboxContext = createContext(null);

export function useLightbox() {
  return useContext(LightboxContext);
}

export default function LightboxProvider({ children }) {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState('50% 50%');
  const reduce = useReducedMotion();
  const imgRef = useRef(null);

  const open = useCallback((list, start = 0) => {
    setItems(list);
    setIndex(start);
    setZoom(1);
    setOrigin('50% 50%');
  }, []);

  const close = useCallback(() => {
    setItems([]);
    setZoom(1);
  }, []);

  const step = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + items.length) % items.length);
      setZoom(1);
      setOrigin('50% 50%');
    },
    [items.length]
  );

  useEffect(() => {
    if (!items.length) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [items.length, close, step]);

  const toggleZoom = (e) => {
    if (zoom === 1) {
      const el = imgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setOrigin(`${x}% ${y}%`);
      setZoom(2);
    } else {
      setZoom(1);
    }
  };

  const value = useMemo(() => ({ open, close }), [open, close]);

  const current = items[index];

  return (
    <LightboxContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {items.length > 0 && current && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={close}
          >
            <div className="lightbox-scrim" />

            <button
              className="lightbox-close"
              onClick={close}
              aria-label="Close viewer"
            >
              &times;
            </button>

            {items.length > 1 && (
              <button
                className="lightbox-arrow lightbox-arrow--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                aria-label="Previous image"
              >
                &#8592;
              </button>
            )}

            <motion.figure
              className="lightbox-stage"
              key={current.src}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lightbox-frame" onClick={toggleZoom}>
                <img
                  ref={imgRef}
                  src={current.src}
                  alt={current.caption || ''}
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: origin,
                    cursor: zoom === 1 ? 'zoom-in' : 'zoom-out',
                  }}
                />
              </div>
              <figcaption className="lightbox-cap">
                {current.caption && <span className="lightbox-title">{current.caption}</span>}
                <span className="lightbox-count">
                  {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
              </figcaption>
            </motion.figure>

            {items.length > 1 && (
              <button
                className="lightbox-arrow lightbox-arrow--next"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                aria-label="Next image"
              >
                &#8594;
              </button>
            )}

            <div className="lightbox-hint">Click image to zoom &middot; arrow keys to navigate</div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}