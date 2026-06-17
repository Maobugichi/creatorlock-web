"use client";

import { motion, useReducedMotion } from "motion/react";

import Image from "next/image";
import ParallaxCoin from "./parallaxCoin";
import { useParallax } from "@/hooks/hero.hooks";
import Link from "next/link";
import { useState } from "react";
//import { COINS } from "../constant/hero.constant";

const Hero = () => {
  const [ hovered, setHovered ] = useState<boolean>(false)
  const { sectionRef, smoothX, smoothY } = useParallax();
  
  const reduce = useReducedMotion();

  const fadeUp = {
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
  };


   const COINS = [
    {
      size: 300, rotate: 10, skewX: 10, skewY: -10, scale: 0.8,
      opacity: 0.55, blur: 0, depth: 0.03,
      className: "top-[8%] left-[0%] hidden md:block",
    },
    {
      size: 210, rotate: 30, skewX: -10, skewY: 2, scale: 1.0,
      opacity: 0.55, blur: 0.4, depth: 0.05,
      className: "bottom-[10%] md:left-[-3%] left-[-15%]",
    },
    {
      size: 165, rotate: 18, skewX: -8, skewY: 6, scale: 0.8,
      opacity: 0.45, blur: 0.8, depth: 0.04,
      className: "top-[3%] right-[-4%] hidden md:block",
    },
    {
      size: 220, rotate: -8, skewX: 14, skewY: -6, scale: 1.15,
      opacity: 0.72, blur: 0, depth: 0.06,
      className: "top-[35%] md:right-[-5%] right-[-20%]",
    },
    {
      size: 185, rotate: -14, skewX: 10, skewY: -8, scale: 0.92,
      opacity: 0.58, blur: 0.3, depth: 0.035,
      className: "bottom-[84%] md:bottom-[80%] right-[25%]",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="min-h-[clamp(600px,80vh,900px)] flex items-center justify-center bg-neutral-950 text-white relative overflow-hidden"
    >
      {COINS.map((coin, i) => (
        <ParallaxCoin key={i} {...coin} smoothX={smoothX} smoothY={smoothY} />
      ))}

      <div className="max-w-3xl relative z-10  grid gap-5 place-items-center">
        <h1 className="text-[clamp(2rem,5vw,3.75rem)] text-center font-bold">
          Your knowledge.<br />
          <span className="text-[#FB5C06]">
            Pr
            <span>
              <Image
                src="/lock.png"
                alt="o"
                width={40}
                height={40}
                priority
                style={{ display: "inline", width: "0.7em", height: "0.7em", verticalAlign: "middle" }}
              />
            </span>
            tected.
          </span>{" "}
          Profitable.
        </h1>

         <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="font-inter text-base text-center sm:text-lg text-white/60 max-w-xl leading-relaxed"
        >
          The marketplace built for Nigerian creators. Sell eBooks, courses,
          templates, and music — paid in Naira, delivered instantly, zero
          platform drama.
        </motion.p>

        {/* Primary CTA — scroll anchor to #how-it-works */}
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="overflow-hidden relative rounded-lg py-4 px-6 text-md  font-bold whitespace-nowrap cursor-pointer"
            style={{ backgroundColor: "#FF5C00" }}
          >
            <Link href="/discover" className="block">
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-white"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="relative z-10"
                animate={{ color: hovered ? "#FF5C00" : "#ffffff" }}
                transition={{ duration: 0.3 }}
              >
                Discover
              </motion.span>
            </Link>
          </motion.div>

        
      </div>
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/20"
      >
        <span className="font-mono text-xs tracking-widest uppercase">scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M8 4v12M8 16l-4-4M8 16l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;