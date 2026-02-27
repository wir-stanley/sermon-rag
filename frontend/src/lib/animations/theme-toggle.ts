// Theme toggle: sun morphing into moon
const themeToggle = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 24,
  h: 24,
  nm: "Theme Toggle",
  ddd: 0,
  assets: [],
  layers: [
    // Sun/Moon core
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Core",
      sr: 1,
      ks: {
        o: { a: 0, k: [100] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [12, 12, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [110, 110, 100] }, { t: 30, s: [110, 110, 100], e: [100, 100, 100] }, { t: 60, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [10, 10] }, p: { a: 0, k: [0, 0] }, nm: "Core" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Core Group",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
    // Rays
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Rays",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [60], e: [80] }, { t: 30, s: [80], e: [60] }, { t: 60, s: [60] }] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [180] }, { t: 60, s: [180] }] },
        p: { a: 0, k: [12, 12, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        ...Array.from({ length: 6 }, (_, i) => ({
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [1.5, 3] }, p: { a: 0, k: [0, -8] }, r: { a: 0, k: 0.5 }, nm: "Ray" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: i * 60 }, o: { a: 0, k: 100 } },
          ],
          nm: `Ray ${i}`,
        })),
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
};

export default themeToggle;
