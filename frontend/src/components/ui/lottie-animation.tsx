"use client";

import dynamic from "next/dynamic";
import type { LottieComponentProps } from "lottie-react";
import { forwardRef } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface LottieAnimationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lottieRef?: React.Ref<any>;
}

const LottieAnimation = forwardRef<HTMLDivElement, LottieAnimationProps>(
  function LottieAnimation(
    { animationData, loop = true, autoplay = true, className, style, lottieRef },
    ref
  ) {
    return (
      <div ref={ref} className={className} style={style}>
        <Lottie
          animationData={animationData}
          loop={loop}
          autoplay={autoplay}
          lottieRef={lottieRef as LottieComponentProps["lottieRef"]}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
);

export default LottieAnimation;
