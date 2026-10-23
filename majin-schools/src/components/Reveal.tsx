import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({ children, className = '', delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function ImageReveal({ src, alt, className = '', delay = 0 }: { src: string; alt: string; className?: string; delay?: number }) {
  return <motion.div className={`image-reveal ${className}`} initial={{ opacity: 0, scale: 1.035 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}><img src={src} alt={alt} loading="lazy" /></motion.div>;
}
