import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16 md:w-20 md:h-20",
  md: "w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36",
  lg: "w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52",
  xl: "w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72",
};

const sizeDimensions = {
  sm: { width: 80, height: 80 },
  md: { width: 144, height: 144 },
  lg: { width: 208, height: 208 },
  xl: { width: 288, height: 288 },
};

export function Logo({ size = "md", className }: LogoProps) {
  const { width, height } = sizeDimensions[size];

  return (
    <div className={cn("flex items-center justify-center", sizeClasses[size], className)}>
      <Image
        src="/logo.png"
        alt="Auto Serve Logo"
        width={width}
        height={height}
        className="object-contain drop-shadow-xl w-full h-full"
        priority
      />
    </div>
  );
}