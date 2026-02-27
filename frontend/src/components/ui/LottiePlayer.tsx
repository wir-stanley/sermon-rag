"use client";

import dynamic from "next/dynamic";
import type { LottieComponentProps } from "lottie-react";

// Dynamically import Lottie to prevent SSR hydration errors and reduce initial bundle size
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export interface LottiePlayerProps extends Omit<LottieComponentProps, "animationData"> {
    animationData: unknown;
    className?: string;
}

export default function LottiePlayer({
    animationData,
    className,
    loop = true,
    autoplay = true,
    ...props
}: LottiePlayerProps) {
    // We check for animationData to prevent the player from crashing if data hasn't loaded
    if (!animationData) return null;

    return (
        <div className={className}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                {...props}
            />
        </div>
    );
}
