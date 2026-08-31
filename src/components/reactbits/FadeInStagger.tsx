"use client";

// Lightweight stagger-fade wrapper built on `motion`, in the spirit of React
// Bits' Animations category — hand-written (rather than pulling react-bits'
// own AnimatedContent/FadeContent, which depend on gsap) so the app only
// carries one animation library instead of two.
import { motion, type Variants } from "motion/react";
import { Children, isValidElement, type ReactNode } from "react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export default function FadeInStagger({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {Children.map(children, (child) =>
        isValidElement(child) ? <motion.div variants={item}>{child}</motion.div> : child,
      )}
    </motion.div>
  );
}
