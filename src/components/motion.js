import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const EASE = [0.2, 0.7, 0.2, 1];

// Fades and lifts its content in the first time it scrolls into view.
export function Reveal({ children, delay = 0, y = 28, as = 'div', className, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Grid whose children appear one after another.
export function Stagger({ children, className, step = 0.08 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

// Card that tilts in 3D towards the pointer.
export function TiltCard({ children, className, max = 8, as = 'div', ...rest }) {
  const Tag = motion[as];
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), { stiffness: 220, damping: 20 });
  const glowX = useTransform(x, (v) => `${v * 100}%`);
  const glowY = useTransform(y, (v) => `${v * 100}%`);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  if (reduce) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }
  return (
    <Tag
      className={`tilt ${className || ''}`}
      style={{ rotateX, rotateY, transformPerspective: 900, '--gx': glowX, '--gy': glowY }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      variants={staggerItem}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Thin bar at the top of the page that follows scroll progress.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

// Counts up to a value like "3" or "10+" when it becomes visible.
export function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const target = parseInt(value, 10);
  const suffix = Number.isNaN(target) ? '' : value.slice(String(target).length);
  const [shown, setShown] = useState(Number.isNaN(target) || reduce ? value : `0${suffix}`);

  useEffect(() => {
    if (!inView || Number.isNaN(target) || reduce) return;
    const controls = animate(0, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setShown(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, target, suffix, reduce]);

  return <span ref={ref}>{shown}</span>;
}
