export default function RainbowLogo() {
    return (
        <div className="relative group w-14 h-14 flex items-center justify-center animate-float">
            <div className="absolute inset-0 rainbow-bg rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow"></div>

            {/* Container to cut out the inner background so it stays dark */}
            <div className="relative w-[3.2rem] h-[3.2rem] bg-black rounded-xl flex items-center justify-center z-10 border border-white/10 shadow-inner">

                {/* Abstract squiggly looping SVG reminiscent of Height 2.0 */}
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-7 h-7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <defs>
                        <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff0080" />
                            <stop offset="50%" stopColor="#ff8c00" />
                            <stop offset="100%" stopColor="#00a3ff" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M6 18c-2.2 0-4-1.8-4-4s1.8-4 4-4h4v-4c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4h-4v4c0 2.2-1.8 4-4 4z"
                        stroke="url(#rainbow-grad)"
                    />
                </svg>

            </div>
        </div>
    );
}
