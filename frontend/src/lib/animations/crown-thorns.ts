// Crown of thorns: minimalist circular crown with thorns and pulsing gold light rays
const GOLD: number[] = [0.83, 0.63, 0.07, 1];
const GOLD2: number[] = [0.9, 0.73, 0.17, 1];

const cx = 30;
const cy = 30;
const ringRadius = 16;
const thornCount = 10;
const rayCount = 8;

// Layer 0: Soft glow behind the crown (pulsing)
const glowLayer = {
  ddd: 0,
  ind: 0,
  ty: 4,
  nm: "Glow",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [15], e: [35] },
        { t: 45, s: [35], e: [15] },
        { t: 90, s: [15] },
      ],
    },
    r: { a: 0, k: [0] },
    p: { a: 0, k: [cx, cy, 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: {
      a: 1,
      k: [
        { t: 0, s: [100, 100, 100], e: [130, 130, 100] },
        { t: 45, s: [130, 130, 100], e: [100, 100, 100] },
        { t: 90, s: [100, 100, 100] },
      ],
    },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        { ty: "el", d: 1, s: { a: 0, k: [40, 40] }, p: { a: 0, k: [0, 0] }, nm: "Glow Circle" },
        { ty: "fl", c: { a: 0, k: GOLD2 }, o: { a: 0, k: 25 }, r: 1, nm: "Fill" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
      nm: "Glow Group",
    },
  ],
  ip: 0,
  op: 90,
  st: 0,
};

// Layer 1: Light rays emanating from the crown
const rayLayers = Array.from({ length: rayCount }, (_, i) => {
  const angle = (i * Math.PI * 2) / rayCount;
  const innerR = ringRadius + 2;
  const outerR = ringRadius + 10;
  const x1 = cx + Math.cos(angle) * innerR;
  const y1 = cy + Math.sin(angle) * innerR;
  const x2 = cx + Math.cos(angle) * outerR;
  const y2 = cy + Math.sin(angle) * outerR;

  const stagger = (i * 10) % 90;
  const midFrame = (stagger + 45) % 90;
  const kfs = [
    { t: stagger, v: 10 },
    { t: midFrame, v: 50 },
  ].sort((a, b) => a.t - b.t);

  const opacityKfs = [
    { t: kfs[0].t, s: [kfs[0].v], e: [kfs[1].v] },
    { t: kfs[1].t, s: [kfs[1].v], e: [kfs[0].v] },
    { t: 89, s: [kfs[0].v] },
  ];

  return {
    ddd: 0,
    ind: 1 + i,
    ty: 4,
    nm: `Ray ${i}`,
    sr: 1,
    ks: {
      o: { a: 1, k: opacityKfs },
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
                v: [[x1, y1], [x2, y2]],
                c: false,
              },
            },
            nm: "Ray Path",
          },
          { ty: "st", c: { a: 0, k: GOLD2 }, o: { a: 0, k: 80 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
        nm: `Ray Group ${i}`,
      },
    ],
    ip: 0,
    op: 90,
    st: 0,
  };
});

// Layer: Crown ring (circle stroke)
const ringLayer = {
  ddd: 0,
  ind: 1 + rayCount,
  ty: 4,
  nm: "Crown Ring",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [75], e: [100] },
        { t: 45, s: [100], e: [75] },
        { t: 90, s: [75] },
      ],
    },
    r: { a: 0, k: [0] },
    p: { a: 0, k: [cx, cy, 0] },
    a: { a: 0, k: [0, 0, 0] },
    s: { a: 0, k: [100, 100, 100] },
  },
  ao: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        { ty: "el", d: 1, s: { a: 0, k: [ringRadius * 2, ringRadius * 2] }, p: { a: 0, k: [0, 0] }, nm: "Ring" },
        { ty: "st", c: { a: 0, k: GOLD }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2, nm: "Stroke" },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
      nm: "Ring Group",
    },
  ],
  ip: 0,
  op: 90,
  st: 0,
};

// Thorn layers: small triangular spikes around the ring
const thornLayers = Array.from({ length: thornCount }, (_, i) => {
  const angle = (i * Math.PI * 2) / thornCount;
  // Thorn base sits on the ring, pointing outward
  const baseX = cx + Math.cos(angle) * ringRadius;
  const baseY = cy + Math.sin(angle) * ringRadius;
  // Thorn tip points outward
  const tipX = cx + Math.cos(angle) * (ringRadius + 5);
  const tipY = cy + Math.sin(angle) * (ringRadius + 5);
  // Two base corners perpendicular to the radial direction
  const perpAngle = angle + Math.PI / 2;
  const halfBase = 1.5;
  const b1x = baseX + Math.cos(perpAngle) * halfBase;
  const b1y = baseY + Math.sin(perpAngle) * halfBase;
  const b2x = baseX - Math.cos(perpAngle) * halfBase;
  const b2y = baseY - Math.sin(perpAngle) * halfBase;

  return {
    ddd: 0,
    ind: 2 + rayCount + i,
    ty: 4,
    nm: `Thorn ${i}`,
    sr: 1,
    ks: {
      o: { a: 0, k: [85] },
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
                i: [[0, 0], [0, 0], [0, 0]],
                o: [[0, 0], [0, 0], [0, 0]],
                v: [
                  [Math.round(b1x * 100) / 100, Math.round(b1y * 100) / 100],
                  [Math.round(tipX * 100) / 100, Math.round(tipY * 100) / 100],
                  [Math.round(b2x * 100) / 100, Math.round(b2y * 100) / 100],
                ],
                c: true,
              },
            },
            nm: "Thorn Shape",
          },
          { ty: "fl", c: { a: 0, k: GOLD }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
        ],
        nm: `Thorn Group ${i}`,
      },
    ],
    ip: 0,
    op: 90,
    st: 0,
  };
});

const crownThorns = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 60,
  h: 60,
  nm: "Crown of Thorns",
  ddd: 0,
  assets: [],
  layers: [glowLayer, ...rayLayers, ringLayer, ...thornLayers],
};

export default crownThorns;
