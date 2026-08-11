import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import Reveal from './Reveal.jsx';

const flipVariants = (reduce) => ({
  enter: (d) =>
    d === 'next'
      ? { x: '42%', rotateY: reduce ? 0 : -48, opacity: 0.55 }
      : { x: '-42%', rotateY: reduce ? 0 : 48, opacity: 0.55 },
  center: { x: 0, rotateY: 0, opacity: 1 },
  exit: (d) =>
    d === 'next'
      ? { x: '-58%', rotateY: reduce ? 0 : -26, opacity: 0 }
      : { x: '58%', rotateY: reduce ? 0 : 26, opacity: 0 },
});

function Page({ img, num, total, dir, onDragEnd }) {
  const reduce = useReducedMotion();
  const variants = flipVariants(reduce);

  return (
    <motion.div
      className="lb-page"
      custom={dir}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      drag="x"
      dragElastic={0.6}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 0.985, cursor: 'grabbing' }}
      style={{
        transformPerspective: reduce ? undefined : 1500,
        cursor: 'grab',
      }}
    >
      <div className="lb-sheet">
        <img src={img} alt={`Look ${String(num).padStart(2, '0')}`} draggable={false} />
        <div className="lb-sheet-cap">
          <strong>Look {String(num).padStart(2, '0')}</strong>
          <span>{num} / {total}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Lookbook({ images }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState('next');
  const total = images.length;

  const go = useCallback(
    (nextDir) => {
      setCurrent((c) => {
        if (nextDir === 'next' && c >= total - 1) return c;
        if (nextDir === 'prev' && c <= 0) return c;
        return nextDir === 'next' ? c + 1 : c - 1;
      });
      setDir(nextDir);
    },
    [total]
  );

  const onDragEnd = useCallback(
    (_, info) => {
      if (info.offset.x < -70) go('next');
      else if (info.offset.x > 70) go('prev');
    },
    [go]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go('next');
      if (e.key === 'ArrowLeft') go('prev');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e) => {
      const rect = el.getBoundingClientRect();
      const over = e.clientX >= rect.left && e.clientX <= rect.right;
      if (!over) return;
      if (e.deltaX < -30) go('next');
      else if (e.deltaX > 30) go('prev');
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [go]);

  return (
    <section id="lookbook" className="lookbook">
      <div className="lb-head">
        <Reveal>
          <div className="lb-intro">
            <span className="eyebrow">Chapter One</span>
            <h2 className="display">The Nholyn Lookbook</h2>
            <p>
              Twenty-two looks, one after another — flip through like the pages of a magazine.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="lb-book" ref={ref}>
        <div className="lb-book-shadow" aria-hidden="true" />

        <button
          className="lb-arrow lb-arrow--prev"
          onClick={() => go('prev')}
          disabled={current === 0}
          aria-label="Previous look"
        >
          &#8592;
        </button>

        <div className="lb-stage">
          <AnimatePresence custom={dir} initial={false}>
            <Page
              key={images[current]}
              img={images[current]}
              num={current + 1}
              total={total}
              dir={dir}
              onDragEnd={onDragEnd}
            />
          </AnimatePresence>
        </div>

        <button
          className="lb-arrow lb-arrow--next"
          onClick={() => go('next')}
          disabled={current === total - 1}
          aria-label="Next look"
        >
          &#8594;
        </button>
      </div>

      <div className="lb-progress" aria-hidden="true">
        <div className="lb-progress-track">
          <motion.div
            className="lb-progress-fill"
            animate={{ width: `${((current + 1) / total) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="lb-progress-num">
          {String(current + 1).padStart(2, '0')} / {total}
        </div>
      </div>
    </section>
  );
}
