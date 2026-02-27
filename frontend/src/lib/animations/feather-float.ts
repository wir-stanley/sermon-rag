// Feather float: single gold feather drifting down in S-curve pattern
const GOLD: number[] = [0.83, 0.63, 0.07, 1];
const GOLD2: number[] = [0.9, 0.73, 0.17, 1];

const w = 60;
const h = 120;
const cx = w / 2;

// S-curve waypoints: feather drifts left-right while falling
// 120 frames total, 4 segments of 30 frames each
const waypoints = [
  { t: 0, x: cx, y: -10 },         // Start above canvas
  { t: 30, x: cx + 18, y: 25 },    // Drift right
  { t: 60, x: cx - 12, y: 55 },    // Drift left
  { t: 90, x: cx + 15, y: 85 },    // Drift right again
  { t: 120, x: cx - 5, y: 130 },   // Exit below canvas
];

const positionKfs = waypoints.map((wp, i) => {
  if (i < waypoints.length - 1) {
    return {
      t: wp.t,
      s: [wp.x, wp.y, 0],
      e: [waypoints[i + 1].x, waypoints[i + 1].y, 0],
      // Ease in/out for smooth S-curve
      i: { x: [0.42], y: [0.42] },
      o: { x: [0.58], y: [0.58] },
    };
  }
  return { t: wp.t, s: [wp.x, wp.y, 0] };
});

// Gentle rotation oscillation as the feather floats
const rotationKfs = [
  { t: 0, s: [-15], e: [20] },
  { t: 30, s: [20], e: [-25] },
  { t: 60, s: [-25], e: [15] },
  { t: 90, s: [15], e: [-10] },
  { t: 120, s: [-10] },
];

// Feather body (thin rotated ellipse)
const featherBody = {
  ddd: 0,
  ind: 0,
  ty: 4,
  nm: "Feather Body",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [0], e: [90] },
        { t: 10, s: [90], e: [90] },
        { t: 100, s: [90], e: [0] },
        { t: 120, s: [0] },
      ],
    },
    r: { a: 1, k: rotationKfs },
    p: { a: 1, k: positionKfs },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [6, 22] },
          p: { a: 0, k: [0, 0] },
          nm: "Feather Shape",
        },
        {
          ty: "fl",
          c: { a: 0, k: GOLD },
          o: { a: 0, k: 85 },
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
      nm: "Feather Body Group",
    },
  ],
  ip: 0,
  op: 120,
  st: 0,
};

// Feather spine (center line)
const featherSpine = {
  ddd: 0,
  ind: 1,
  ty: 4,
  nm: "Feather Spine",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [0], e: [70] },
        { t: 10, s: [70], e: [70] },
        { t: 100, s: [70], e: [0] },
        { t: 120, s: [0] },
      ],
    },
    r: { a: 1, k: rotationKfs },
    p: { a: 1, k: positionKfs },
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
              i: [[0, 0], [0, 0]],
              o: [[0, 0], [0, 0]],
              v: [[0, -12], [0, 12]],
              c: false,
            },
          },
          nm: "Spine Path",
        },
        {
          ty: "st",
          c: { a: 0, k: GOLD2 },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 0.6 },
          lc: 2,
          lj: 2,
          nm: "Stroke",
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
      nm: "Spine Group",
    },
  ],
  ip: 0,
  op: 120,
  st: 0,
};

// Soft glow following the feather
const featherGlow = {
  ddd: 0,
  ind: 2,
  ty: 4,
  nm: "Feather Glow",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [0], e: [20] },
        { t: 10, s: [20], e: [20] },
        { t: 100, s: [20], e: [0] },
        { t: 120, s: [0] },
      ],
    },
    r: { a: 1, k: rotationKfs },
    p: { a: 1, k: positionKfs },
    a: { a: 0, k: [0, 0, 0] },
    s: {
      a: 1,
      k: [
        { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
        { t: 60, s: [120, 120, 100], e: [100, 100, 100] },
        { t: 120, s: [100, 100, 100] },
      ],
    },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        {
          ty: "el",
          d: 1,
          s: { a: 0, k: [14, 28] },
          p: { a: 0, k: [0, 0] },
          nm: "Glow Shape",
        },
        {
          ty: "fl",
          c: { a: 0, k: GOLD2 },
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
      nm: "Glow Group",
    },
  ],
  ip: 0,
  op: 120,
  st: 0,
};

// Barb lines (small angled strokes on the feather)
const barbLayers = Array.from({ length: 5 }, (_, i) => {
  const yOff = -10 + i * 5;
  return {
    ddd: 0,
    ind: 3 + i,
    ty: 4,
    nm: `Barb ${i}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: 0, s: [0], e: [50] },
          { t: 10, s: [50], e: [50] },
          { t: 100, s: [50], e: [0] },
          { t: 120, s: [0] },
        ],
      },
      r: { a: 1, k: rotationKfs },
      p: { a: 1, k: positionKfs },
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
                i: [[0, 0], [0, 0]],
                o: [[0, 0], [0, 0]],
                v: [[0, yOff], [i % 2 === 0 ? 3 : -3, yOff - 1.5]],
                c: false,
              },
            },
            nm: "Barb Path",
          },
          {
            ty: "st",
            c: { a: 0, k: GOLD },
            o: { a: 0, k: 60 },
            w: { a: 0, k: 0.4 },
            lc: 2,
            lj: 2,
            nm: "Stroke",
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
        nm: `Barb Group ${i}`,
      },
    ],
    ip: 0,
    op: 120,
    st: 0,
  };
});

const featherFloat = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 60,
  h: 120,
  nm: "Feather Float",
  ddd: 0,
  assets: [],
  layers: [featherGlow, featherBody, featherSpine, ...barbLayers],
};

export default featherFloat;
