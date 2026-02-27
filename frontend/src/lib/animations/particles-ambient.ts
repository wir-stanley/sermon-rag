// Particles ambient: slow-drifting abstract particles for landing background
const particlesAmbient = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 180,
  w: 800,
  h: 600,
  nm: "Particles Ambient",
  ddd: 0,
  assets: [],
  layers: [
    ...Array.from({ length: 12 }, (_, i) => {
      const startX = 100 + (i * 60) % 700;
      const startY = 50 + (i * 80) % 500;
      const endX = startX + (i % 2 === 0 ? 40 : -40);
      const endY = startY + (i % 3 === 0 ? -30 : 30);
      const size = 3 + (i % 4) * 1.5;
      const delay = i * 12;

      return {
        ddd: 0,
        ind: i,
        ty: 4,
        nm: `Particle ${i}`,
        sr: 1,
        ks: {
          o: { a: 1, k: [
            { t: 0, s: [0], e: [30 + (i % 3) * 10] },
            { t: 40, s: [30 + (i % 3) * 10], e: [30 + (i % 3) * 10] },
            { t: 140, s: [30 + (i % 3) * 10], e: [0] },
            { t: 180, s: [0] },
          ]},
          r: { a: 0, k: [0] },
          p: { a: 1, k: [
            { t: 0, s: [startX, startY, 0], e: [endX, endY, 0] },
            { t: 180, s: [endX, endY, 0] },
          ]},
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { t: 0, s: [80, 80, 100], e: [120, 120, 100] },
            { t: 90, s: [120, 120, 100], e: [80, 80, 100] },
            { t: 180, s: [80, 80, 100] },
          ]},
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [size, size] }, p: { a: 0, k: [0, 0] }, nm: "Dot" },
              { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 40 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
            nm: "Particle Group",
          },
        ],
        ip: delay,
        op: 180,
        st: delay,
      };
    }),
  ],
};

export default particlesAmbient;
