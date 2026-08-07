import Image from "next/image";

interface CoinProps {
  size?: number;
  rotate?: number;
  skewX?: number;
  skewY?: number;
  scale?: number;
  opacity?: number;
  blur?: number;
  className?:string;
  
}

const Coin = ({
  size = 180,
  rotate = 0,
  skewX = 0,
  skewY = 0,
  scale = 1,
  opacity = 0.5,
  blur = 0,
  className,
}: CoinProps) => {
  return (
    <div
      className={`absolute ${className}`}
      style={{
      
        transform: `rotate(${rotate}deg) skewX(${skewX}deg) skewY(${skewY}deg) scale(${scale})`,
      
        filter: blur ? `blur(${blur}px)` : undefined,
        zIndex: 0,
      }}
    >
      <Image
        src="/lightorange.svg"
        alt="coin"
        width={size}
        height={size}
      />
    </div>
  );
}

export default Coin