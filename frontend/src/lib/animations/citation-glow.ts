// Citation glow: golden shimmer border on expand
const citationGlow = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 45,
  w: 300,
  h: 100,
  nm: "Citation Glow",
  ddd: 0,
  assets: [],
  layers: [
    // Shimmer traveling along border
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Shimmer",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [70] }, { t: 10, s: [70], e: [70] }, { t: 35, s: [70], e: [0] }, { t: 45, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 1, k: [
          { t: 0, s: [0, 50, 0], e: [150, 0, 0] },
          { t: 15, s: [150, 0, 0], e: [300, 50, 0] },
          { t: 30, s: [300, 50, 0], e: [150, 100, 0] },
          { t: 45, s: [150, 100, 0] },
        ]},
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [20, 20] }, p: { a: 0, k: [0, 0] }, nm: "Glow" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 50 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Glow Group",
        },
      ],
      ip: 0,
      op: 45,
      st: 0,
    },
    // Border flash
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Border",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [40] }, { t: 8, s: [40], e: [40] }, { t: 38, s: [40], e: [0] }, { t: 45, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [150, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [296, 96] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 8 }, nm: "Border" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 1.5 }, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Border Group",
        },
      ],
      ip: 0,
      op: 45,
      st: 0,
    },
  ],
};

export default citationGlow;
