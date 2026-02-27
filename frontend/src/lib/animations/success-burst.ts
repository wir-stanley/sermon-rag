// Success burst: starburst celebration (plays once)
const successBurst = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 30,
  w: 60,
  h: 60,
  nm: "Success Burst",
  ddd: 0,
  assets: [],
  layers: [
    // Expanding ring
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Ring",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [80], e: [0] }, { t: 30, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [30, 30, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [30, 30, 100], e: [150, 150, 100] }, { t: 30, s: [150, 150, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [30, 30] }, p: { a: 0, k: [0, 0] }, nm: "Ring" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Ring Group",
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
    },
    // Particles
    ...Array.from({ length: 6 }, (_, i) => ({
      ddd: 0,
      ind: i + 1,
      ty: 4,
      nm: `Particle ${i}`,
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [100], e: [0] }, { t: 25, s: [0] }] },
        r: { a: 0, k: [0] },
        p: {
          a: 1,
          k: [
            { t: 0, s: [30, 30, 0], e: [30 + Math.cos((i * Math.PI * 2) / 6) * 25, 30 + Math.sin((i * Math.PI * 2) / 6) * 25, 0] },
            { t: 25, s: [30 + Math.cos((i * Math.PI * 2) / 6) * 25, 30 + Math.sin((i * Math.PI * 2) / 6) * 25, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [30, 30, 100] }, { t: 25, s: [30, 30, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [4, 4] }, p: { a: 0, k: [0, 0] }, nm: "Dot" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Particle Group",
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
    })),
  ],
};

export default successBurst;
