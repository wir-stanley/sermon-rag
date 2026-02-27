// Open Bible with fluttering pages animation
const openBible = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 120,
  h: 120,
  nm: "Open Bible",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Left Page",
      sr: 1,
      ks: {
        o: { a: 0, k: [100] },
        r: { a: 1, k: [{ t: 0, s: [-5], e: [0] }, { t: 45, s: [0], e: [-5] }, { t: 90, s: [-5] }] },
        p: { a: 0, k: [48, 55, 0] },
        a: { a: 0, k: [20, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [40, 50] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 3 }, nm: "Page" },
            { ty: "fl", c: { a: 0, k: [0.96, 0.93, 0.88, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 30 }, w: { a: 0, k: 0.5 }, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Left Page Group",
        },
        // Text lines
        ...Array.from({ length: 5 }, (_, i) => ({
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [28 - i * 2, 1.5] }, p: { a: 0, k: [-2, -16 + i * 7] }, r: { a: 0, k: 0.5 }, nm: "Line" },
            { ty: "fl", c: { a: 0, k: [0.17, 0.16, 0.16, 1] }, o: { a: 0, k: 20 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: `Line ${i}`,
        })),
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Right Page",
      sr: 1,
      ks: {
        o: { a: 0, k: [100] },
        r: { a: 1, k: [{ t: 0, s: [5], e: [0] }, { t: 45, s: [0], e: [5] }, { t: 90, s: [5] }] },
        p: { a: 0, k: [72, 55, 0] },
        a: { a: 0, k: [-20, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [40, 50] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 3 }, nm: "Page" },
            { ty: "fl", c: { a: 0, k: [0.96, 0.93, 0.88, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 30 }, w: { a: 0, k: 0.5 }, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Right Page Group",
        },
        ...Array.from({ length: 5 }, (_, i) => ({
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [28 - i * 2, 1.5] }, p: { a: 0, k: [2, -16 + i * 7] }, r: { a: 0, k: 0.5 }, nm: "Line" },
            { ty: "fl", c: { a: 0, k: [0.17, 0.16, 0.16, 1] }, o: { a: 0, k: 20 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: `Line ${i}`,
        })),
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Spine",
      sr: 1,
      ks: {
        o: { a: 0, k: [100] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [60, 55, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [4, 52] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 1 }, nm: "Spine" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 60 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Spine Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Gold glow under the book
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Book Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [15], e: [30] }, { t: 45, s: [30], e: [15] }, { t: 90, s: [15] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [60, 58, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [90, 60] }, p: { a: 0, k: [0, 0] }, nm: "Glow" },
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
  ],
};

export default openBible;
