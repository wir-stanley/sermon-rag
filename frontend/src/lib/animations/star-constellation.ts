// Star constellation: 7 twinkling stars connected by thin gold lines
const GOLD: [number, number, number, number] = [0.83, 0.63, 0.07, 1];
const GOLD2: [number, number, number, number] = [0.9, 0.73, 0.17, 1];

// Star positions spread across 400x300
const stars: [number, number][] = [
  [60, 50],
  [150, 80],
  [280, 40],
  [350, 120],
  [240, 180],
  [100, 200],
  [320, 250],
];

// Connections between stars (index pairs)
const connections: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [1, 4],
  [2, 4],
];

// Build connection line layers
const lineLayers = connections.map(([a, b], i) => ({
  ddd: 0,
  ind: i,
  ty: 4,
  nm: `Line ${a}-${b}`,
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [20], e: [45] },
        { t: 90, s: [45], e: [20] },
        { t: 180, s: [20] },
      ],
    },
    r: { a: 0, k: [0] },
    p: { a: 0, k: [0, 0, 0] },
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
              v: [stars[a], stars[b]],
              c: false,
            },
          },
          nm: "Path",
        },
        {
          ty: "st",
          c: { a: 0, k: GOLD as unknown as number[] },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 0.8 },
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
      nm: `Line Group ${a}-${b}`,
    },
  ],
  ip: 0,
  op: 180,
  st: 0,
}));

// Build star dot layers with staggered twinkling
const starLayers = stars.map(([x, y], i) => {
  // Stagger twinkle timing: each star offsets by ~25 frames
  const offset = i * 25;
  const t0 = offset % 180;
  const t1 = (offset + 45) % 180;
  const t2 = (offset + 90) % 180;
  const t3 = (offset + 135) % 180;

  // Sort keyframes chronologically for valid Lottie
  const rawKfs = [
    { t: t0, v: 30 },
    { t: t1, v: 100 },
    { t: t2, v: 30 },
    { t: t3, v: 100 },
  ].sort((a, b) => a.t - b.t);

  const opacityKfs = rawKfs.map((kf, idx) => {
    if (idx < rawKfs.length - 1) {
      return { t: kf.t, s: [kf.v], e: [rawKfs[idx + 1].v] };
    }
    return { t: kf.t, s: [kf.v] };
  });

  return {
    ddd: 0,
    ind: connections.length + i,
    ty: 4,
    nm: `Star ${i}`,
    sr: 1,
    ks: {
      o: { a: 1, k: opacityKfs },
      r: { a: 0, k: [0] },
      p: { a: 0, k: [x, y, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          { t: t0, s: [80, 80, 100], e: [120, 120, 100] },
          { t: (t0 + 90) % 180, s: [120, 120, 100], e: [80, 80, 100] },
          { t: (t0 + 179) % 180 || 179, s: [80, 80, 100] },
        ].sort((a, b) => a.t - b.t),
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
            s: { a: 0, k: [6, 6] },
            p: { a: 0, k: [0, 0] },
            nm: "Star Dot",
          },
          {
            ty: "fl",
            c: { a: 0, k: i % 2 === 0 ? (GOLD as unknown as number[]) : (GOLD2 as unknown as number[]) },
            o: { a: 0, k: 100 },
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
        nm: `Star Group ${i}`,
      },
    ],
    ip: 0,
    op: 180,
    st: 0,
  };
});

// Outer glow layers for brighter stars
const glowLayers = [0, 2, 4, 6].map((i, gi) => {
  const [x, y] = stars[i];
  const offset = i * 25;
  const t0 = offset % 180;
  const tMid = (t0 + 90) % 180;
  const sortedKfs = [
    { t: t0, s: [0], e: [25] },
    { t: tMid, s: [25], e: [0] },
    { t: 179, s: [0] },
  ].sort((a, b) => a.t - b.t);

  return {
    ddd: 0,
    ind: connections.length + stars.length + gi,
    ty: 4,
    nm: `Glow ${i}`,
    sr: 1,
    ks: {
      o: { a: 1, k: sortedKfs },
      r: { a: 0, k: [0] },
      p: { a: 0, k: [x, y, 0] },
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
            s: { a: 0, k: [16, 16] },
            p: { a: 0, k: [0, 0] },
            nm: "Glow Dot",
          },
          {
            ty: "fl",
            c: { a: 0, k: GOLD2 as unknown as number[] },
            o: { a: 0, k: 40 },
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
        nm: `Glow Group ${i}`,
      },
    ],
    ip: 0,
    op: 180,
    st: 0,
  };
});

const starConstellation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 180,
  w: 400,
  h: 300,
  nm: "Star Constellation",
  ddd: 0,
  assets: [],
  layers: [...lineLayers, ...glowLayers, ...starLayers],
};

export default starConstellation;
