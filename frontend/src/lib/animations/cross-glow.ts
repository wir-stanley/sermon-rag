// Cross glow: minimalist cross with pulsing radiance
const crossGlow = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 40,
  h: 40,
  nm: "Cross Glow",
  ddd: 0,
  assets: [],
  layers: [
    // Glow circle behind
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [20], e: [40] }, { t: 45, s: [40], e: [20] }, { t: 90, s: [20] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [20, 20, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [120, 120, 100] }, { t: 45, s: [120, 120, 100], e: [100, 100, 100] }, { t: 90, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [30, 30] }, p: { a: 0, k: [0, 0] }, nm: "Glow" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 20 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Glow Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Cross
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Cross",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [70], e: [100] }, { t: 45, s: [100], e: [70] }, { t: 90, s: [70] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [20, 20, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        // Vertical bar
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [3, 18] }, p: { a: 0, k: [0, 1] }, r: { a: 0, k: 1 }, nm: "Vertical" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Vertical Bar",
        },
        // Horizontal bar
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [12, 3] }, p: { a: 0, k: [0, -3] }, r: { a: 0, k: 1 }, nm: "Horizontal" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Horizontal Bar",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
  ],
};

export default crossGlow;
