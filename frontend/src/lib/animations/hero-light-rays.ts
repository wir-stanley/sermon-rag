// Hero light rays: radiating gold light rays animation
const heroLightRays = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 400,
  h: 400,
  nm: "Hero Light Rays",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Ray 1",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [20], e: [60] }, { t: 60, s: [60], e: [20] }, { t: 120, s: [20] }] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120, s: [360] }] },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [120, 120, 100] }, { t: 60, s: [120, 120, 100], e: [100, 100, 100] }, { t: 120, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        ...Array.from({ length: 8 }, (_, i) => ({
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [3, 180] },
              p: { a: 0, k: [0, -100] },
              r: { a: 0, k: 0 },
              nm: "Rect",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.83, 0.63, 0.07, 1] },
              o: { a: 0, k: 40 },
              r: 1,
              nm: "Fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: i * 45 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: `Ray ${i}`,
        })),
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [30], e: [50] }, { t: 60, s: [50], e: [30] }, { t: 120, s: [30] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [130, 130, 100] }, { t: 60, s: [130, 130, 100], e: [100, 100, 100] }, { t: 120, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              d: 1,
              s: { a: 0, k: [120, 120] },
              p: { a: 0, k: [0, 0] },
              nm: "Ellipse",
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.83, 0.63, 0.07, 1] },
              o: { a: 0, k: 25 },
              r: 1,
              nm: "Fill",
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
          nm: "Glow Circle",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
};

export default heroLightRays;
