'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

const Nav = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <nav className="w-full py-4 px-4 md:px-10 border-b border-border bg-background flex items-center justify-between">
      <div
        className='h-12 relative'
        style={{ width: "clamp(60px, 18vw, 50px)" }}
      >
        <Image
          src="/tisolockk.png"
          alt="CreatorLock"
          fill
          priority
          className="object-contain"
        />
      </div>

      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative overflow-hidden rounded-lg cursor-pointer"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <Link href="/discover" className="block px-5 py-3">
          <motion.span
            aria-hidden
            className="absolute inset-0 bg-white"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          />
          <motion.span
            className="relative z-10 text-sm font-semibold font-syne whitespace-nowrap"
            animate={{ color: hovered ? "var(--color-primary)" : "var(--color-primary-foreground)" }}
            transition={{ duration: 0.25 }}
          >
            Discover
          </motion.span>
        </Link>
      </motion.div>
    </nav>
  );
};

export default Nav;