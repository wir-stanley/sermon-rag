// Thinking dove: gentle flight loop for streaming loader
const thinkingDove = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 60,
  h: 60,
  nm: "Thinking Dove",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Dove Body",
      sr: 1,
      ks: {
        o: { a: 0, k: [80] },
        r: { a: 1, k: [{ t: 0, s: [-3], e: [3] }, { t: 30, s: [3], e: [-3] }, { t: 60, s: [-3] }] },
        p: { a: 1, k: [{ t: 0, s: [30, 32, 0], e: [30, 28, 0] }, { t: 30, s: [30, 28, 0], e: [30, 32, 0] }, { t: 60, s: [30, 32, 0] }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        // Body
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [18, 12] }, p: { a: 0, k: [0, 0] }, nm: "Body" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Body Group",
        },
        // Head
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [8, 8] }, p: { a: 0, k: [10, -4] }, nm: "Head" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 80 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Head Group",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
    // Left wing
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Left Wing",
      sr: 1,
      parent: 0,
      ks: {
        o: { a: 0, k: [70] },
        r: { a: 1, k: [{ t: 0, s: [20], e: [-25] }, { t: 15, s: [-25], e: [20] }, { t: 30, s: [20], e: [-25] }, { t: 45, s: [-25], e: [20] }, { t: 60, s: [20] }] },
        p: { a: 0, k: [-4, -4, 0] },
        a: { a: 0, k: [8, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [16, 6] }, p: { a: 0, k: [0, 0] }, nm: "Wing" },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 60 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Wing Group",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
    // Right wing
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Right Wing",
      sr: 1,
      parent: 0,
      ks: {
        o: { a: 0, k: [70] },
        r: { a: 1, k: [{ t: 0, s: [-20], e: [25] }, { t: 15, s: [25], e: [-20] }, { t: 30, s: [-20], e: [25] }, { t: 45, s: [25], e: [-20] }, { t: 60, s: [-20] }] },
        p: { a: 0, k: [4, -4, 0] },
        a: { a: 0, k: [-8, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [16, 6] }, p: { a: 0, k: [0, 0] }, nm: "Wing" },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 60 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Wing Group",
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
    },
  ],
};

export default thinkingDove;
