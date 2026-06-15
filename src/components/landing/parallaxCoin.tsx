import { motion, useSpring, useTransform } from "motion/react";
import Coin from "@/components/ui/Coin";

interface ParallaxCoinProps {
  size: number;
  rotate: number;
  skewX: number;
  skewY: number;
  scale: number;
  opacity: number;
  blur: number;
  depth: number;
  className: string;
  smoothX: ReturnType<typeof useSpring>;
  smoothY: ReturnType<typeof useSpring>;
}

const ParallaxCoin = ({ smoothX, smoothY, depth, className, ...coinProps }: ParallaxCoinProps) => {
  const x = useTransform(smoothX, (v: number) => v * depth * 800);
  const y = useTransform(smoothY, (v: number) => v * depth * 800);

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ x, y, width: coinProps.size, height: coinProps.size }}
    >
      <Coin {...coinProps} />
    </motion.div>
  );
};

export default ParallaxCoin;