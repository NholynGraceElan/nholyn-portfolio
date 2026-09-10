import { motion, useScroll, useSpring, useReducedMotion } from 'motion/react';

export default function ProgressBar() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  if (reduce) return null;
  return (
    <motion.div
      className="progress-bar"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}