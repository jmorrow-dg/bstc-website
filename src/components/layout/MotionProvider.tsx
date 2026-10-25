"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

// reducedMotion="user": every framer-motion animation on the site drops its
// movement when the visitor's system asks for reduced motion.
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
