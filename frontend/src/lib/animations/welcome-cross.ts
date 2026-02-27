// Welcome cross: cross formed by converging light particles
const welcomeCross = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: "Welcome Cross",
  ddd: 0,
  assets: [],
  layers: [
    // Central glow
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Central Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [40] }, { t: 30, s: [40], e: [25] }, { t: 60, s: [25], e: [40] }, { t: 90, s: [40], e: [25] }, { t: 120, s: [25] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [50, 50, 100], e: [100, 100, 100] }, { t: 30, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [60, 60] }, p: { a: 0, k: [0, 0] }, nm: "Glow" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 15 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Glow Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Vertical beam
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Vertical",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [60] }, { t: 20, s: [60] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 0, 100], e: [100, 100, 100] }, { t: 25, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [6, 70] }, p: { a: 0, k: [0, 3] }, r: { a: 0, k: 2 }, nm: "Bar" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 50 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Vertical Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Horizontal beam
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Horizontal",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 10, s: [0], e: [60] }, { t: 30, s: [60] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [100, 90, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 10, s: [0, 100, 100], e: [100, 100, 100] }, { t: 35, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [45, 6] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2 }, nm: "Bar" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 50 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Horizontal Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Converging particles
    ...Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 8;
      const farX = 100 + Math.cos(angle) * 80;
      const farY = 100 + Math.sin(angle) * 80;
      return {
        ddd: 0,
        ind: 3 + i,
        ty: 4,
        nm: `Particle ${i}`,
        sr: 1,
        ks: {
          o: { a: 1, k: [
            { t: 0, s: [0], e: [60] },
            { t: 15, s: [60], e: [60] },
            { t: 25, s: [60], e: [0] },
            { t: 35, s: [0] },
          ]},
          r: { a: 0, k: [0] },
          p: { a: 1, k: [
            { t: 0, s: [farX, farY, 0], e: [100 + Math.cos(angle) * 15, 100 + Math.sin(angle) * 15, 0] },
            { t: 30, s: [100 + Math.cos(angle) * 15, 100 + Math.sin(angle) * 15, 0] },
          ]},
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [4, 4] }, p: { a: 0, k: [0, 0] }, nm: "Dot" },
              { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
            nm: "Particle Group",
          },
        ],
        ip: i * 3,
        op: 120,
        st: i * 3,
      };
    }),
  ],
};

export default welcomeCross;
