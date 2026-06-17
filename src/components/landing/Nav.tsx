'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";

const Nav = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <nav className="w-full py-4 px-4 md:px-10 border-b border-white/10 bg-neutral-950 flex items-center justify-between">
       <div
        className=' h-12 relative'
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

      <div className="flex items-center gap-3">
        {/* Login — ghost */}
        <Link
          href="/login"
          className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-150 px-3 py-2 font-inter"
        >
          Log in
        </Link>

        {/* Register — brand fill with swipe hover */}
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative overflow-hidden rounded-lg cursor-pointer"
          style={{ backgroundColor: "#FB5C06" }}
        >
          <Link href="/signup" className="block px-5 py-3">
            <motion.span
              aria-hidden
              className="absolute inset-0 bg-white"
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: hovered ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
            <motion.span
              className="relative z-10 text-sm font-semibold font-syne whitespace-nowrap"
              animate={{ color: hovered ? "#FB5C06" : "#ffffff" }}
              transition={{ duration: 0.25 }}
            >
              Register
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Nav;