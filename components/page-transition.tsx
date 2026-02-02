"use client"

import type React from "react"
import { motion } from "framer-motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 50, rotateX: 5, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, y: -50, rotateX: -5, filter: "blur(8px)" }}
      transition={{
        type: "spring",
        stiffness: 120, // Softer spring for smoother feel on touch devices
        damping: 20,
        mass: 1,
      }}
      style={{ transformOrigin: "top center" }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
