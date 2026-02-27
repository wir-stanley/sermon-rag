// Sidebar empty: scroll/manuscript unfurling animation
const sidebarEmpty = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 80,
  h: 80,
  nm: "Sidebar Empty",
  ddd: 0,
  assets: [],
  layers: [
    // Scroll body
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Scroll Body",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [80] }, { t: 20, s: [80] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 20, 100], e: [100, 100, 100] }, { t: 30, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [36, 44] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 3 }, nm: "Scroll" },
            { ty: "fl", c: { a: 0, k: [0.93, 0.89, 0.83, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 40 }, w: { a: 0, k: 0.8 }, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Scroll Group",
        },
        // Text lines appearing
        ...Array.from({ length: 4 }, (_, i) => ({
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [22 - i * 2, 1.5] }, p: { a: 0, k: [0, -12 + i * 8] }, r: { a: 0, k: 0.5 }, nm: "Line" },
            { ty: "fl", c: { a: 0, k: [0.17, 0.16, 0.16, 1] }, o: { a: 1, k: [{ t: 30 + i * 8, s: [0], e: [25] }, { t: 38 + i * 8, s: [25] }] }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: `Line ${i}`,
        })),
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Top roll
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Top Roll",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [90] }, { t: 15, s: [90] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [40, 17, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [42, 5] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2.5 }, nm: "Roll" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Roll Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Bottom roll
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Bottom Roll",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [90] }, { t: 15, s: [90] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [40, 63, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [42, 5] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2.5 }, nm: "Roll" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Roll Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
  ],
};

export default sidebarEmpty;
