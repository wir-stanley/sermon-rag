// Bookmark ribbon: gold ribbon sliding down and settling with bounce (plays once)
const GOLD: number[] = [0.83, 0.63, 0.07, 1];
const GOLD2: number[] = [0.9, 0.73, 0.17, 1];

const cx = 10;

// Main ribbon body - slides down from top, bounces, settles
const ribbonBody = {
  ddd: 0,
  ind: 0,
  ty: 4,
  nm: "Ribbon Body",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [0], e: [100] },
        { t: 5, s: [100] },
      ],
    },
    r: { a: 0, k: [0] },
    p: {
      a: 1,
      k: [
        // Start above canvas, slide down
        { t: 0, s: [cx, -20, 0], e: [cx, 28, 0] },
        // Overshoot past target
        { t: 15, s: [cx, 28, 0], e: [cx, 32, 0] },
        // Bounce back up
        { t: 20, s: [cx, 32, 0], e: [cx, 27, 0] },
        // Settle to final position
        { t: 25, s: [cx, 27, 0], e: [cx, 29, 0] },
        { t: 30, s: [cx, 29, 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [12, 48] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 1 },
          nm: "Ribbon Rect",
        },
        {
          ty: "fl",
          c: { a: 0, k: GOLD },
          o: { a: 0, k: 90 },
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
      nm: "Body Group",
    },
  ],
  ip: 0,
  op: 30,
  st: 0,
};

// Ribbon notch at bottom (V-shaped cutout simulated by a darker triangle)
const ribbonNotch = {
  ddd: 0,
  ind: 1,
  ty: 4,
  nm: "Ribbon Notch",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [0], e: [100] },
        { t: 5, s: [100] },
      ],
    },
    r: { a: 0, k: [0] },
    p: {
      a: 1,
      k: [
        { t: 0, s: [cx, -20, 0], e: [cx, 28, 0] },
        { t: 15, s: [cx, 28, 0], e: [cx, 32, 0] },
        { t: 20, s: [cx, 32, 0], e: [cx, 27, 0] },
        { t: 25, s: [cx, 27, 0], e: [cx, 29, 0] },
        { t: 30, s: [cx, 29, 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        {
          ty: "sh",
          d: 1,
          ks: {
            a: 0,
            k: {
              i: [[0, 0], [0, 0], [0, 0]],
              o: [[0, 0], [0, 0], [0, 0]],
              v: [
                [-6, 24],
                [0, 18],
                [6, 24],
              ],
              c: true,
            },
          },
          nm: "Notch",
        },
        {
          ty: "fl",
          c: { a: 0, k: [0, 0, 0, 1] },
          o: { a: 0, k: 100 },
          r: 1,
          nm: "Cutout Fill",
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
      nm: "Notch Group",
    },
  ],
  ip: 0,
  op: 30,
  st: 0,
};

// Highlight strip on the ribbon (lighter gold for gradient effect)
const ribbonHighlight = {
  ddd: 0,
  ind: 2,
  ty: 4,
  nm: "Ribbon Highlight",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [0], e: [60] },
        { t: 5, s: [60], e: [30] },
        { t: 20, s: [30], e: [50] },
        { t: 30, s: [50] },
      ],
    },
    r: { a: 0, k: [0] },
    p: {
      a: 1,
      k: [
        { t: 0, s: [cx + 2, -20, 0], e: [cx + 2, 28, 0] },
        { t: 15, s: [cx + 2, 28, 0], e: [cx + 2, 32, 0] },
        { t: 20, s: [cx + 2, 32, 0], e: [cx + 2, 27, 0] },
        { t: 25, s: [cx + 2, 27, 0], e: [cx + 2, 29, 0] },
        { t: 30, s: [cx + 2, 29, 0] },
      ],
    },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [3, 44] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0.5 },
          nm: "Highlight Strip",
        },
        {
          ty: "fl",
          c: { a: 0, k: GOLD2 },
          o: { a: 0, k: 60 },
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
      nm: "Highlight Group",
    },
  ],
  ip: 0,
  op: 30,
  st: 0,
};

const bookmarkRibbon = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 30,
  w: 20,
  h: 60,
  nm: "Bookmark Ribbon",
  ddd: 0,
  assets: [],
  layers: [ribbonBody, ribbonNotch, ribbonHighlight],
};

export default bookmarkRibbon;
