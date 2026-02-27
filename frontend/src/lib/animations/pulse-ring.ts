// Pulse ring: triple concentric rounded rectangles pulsing outward in sequence
const GOLD: number[] = [0.83, 0.63, 0.07, 1];
const GOLD2: number[] = [0.9, 0.73, 0.17, 1];

const w = 200;
const h = 60;
const cx = w / 2;
const cy = h / 2;

// Base rounded rectangle dimensions (matches a wide input field shape)
const baseW = 160;
const baseH = 36;
const cornerR = 12;

// Each ring: starts at base size, expands outward, fades out
// Staggered by 20 frames, looping over 90 frames
const createRingLayer = (index: number): object => {
  const stagger = index * 20; // 0, 20, 40

  // Frame offsets within the 90-frame loop
  const startFrame = stagger;
  const endFrame = startFrame + 60; // Each ring animates over 60 frames

  // Scale: start at 100%, expand to ~140%
  const scaleStart = [100, 100, 100];
  const scaleEnd = [140, 160, 100];

  // Opacity: start visible, fade to 0
  const opStart = index === 0 ? 60 : index === 1 ? 45 : 35;

  // If endFrame > 90, we need to wrap around
  if (endFrame <= 90) {
    return {
      ddd: 0,
      ind: index,
      ty: 4,
      nm: `Ring ${index}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: startFrame, s: [opStart], e: [0] },
            { t: endFrame, s: [0] },
          ],
        },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [cx, cy, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: startFrame, s: scaleStart, e: scaleEnd },
            { t: endFrame, s: scaleEnd },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [baseW, baseH] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: cornerR },
              nm: "Rect",
            },
            {
              ty: "st",
              c: { a: 0, k: index === 0 ? GOLD : GOLD2 },
              o: { a: 0, k: 100 },
              w: { a: 0, k: index === 0 ? 1.5 : 1 },
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
          nm: `Ring Group ${index}`,
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    };
  }

  // Wrapping case: split into two segments
  const wrapEnd = endFrame - 90;
  return {
    ddd: 0,
    ind: index,
    ty: 4,
    nm: `Ring ${index}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          { t: 0, s: [Math.round(opStart * (1 - wrapEnd / 60))], e: [0] },
          { t: wrapEnd, s: [0], e: [0] },
          { t: startFrame, s: [opStart], e: [0] },
          { t: 89, s: [Math.round(opStart * (1 - (89 - startFrame) / 60))] },
        ],
      },
      r: { a: 0, k: [0] },
      p: { a: 0, k: [cx, cy, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          {
            t: 0,
            s: [
              100 + (40 * (90 - startFrame)) / 60,
              100 + (60 * (90 - startFrame)) / 60,
              100,
            ],
            e: scaleEnd,
          },
          { t: wrapEnd, s: scaleEnd, e: scaleEnd },
          { t: startFrame, s: scaleStart, e: scaleEnd },
          { t: 89, s: [100 + (40 * (89 - startFrame)) / 60, 100 + (60 * (89 - startFrame)) / 60, 100] },
        ],
      },
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          {
            ty: "rc",
            d: 1,
            s: { a: 0, k: [baseW, baseH] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: cornerR },
            nm: "Rect",
          },
          {
            ty: "st",
            c: { a: 0, k: index === 0 ? GOLD : GOLD2 },
            o: { a: 0, k: 100 },
            w: { a: 0, k: index === 0 ? 1.5 : 1 },
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
        nm: `Ring Group ${index}`,
      },
    ],
    ip: 0,
    op: 90,
    st: 0,
  };
};

// Subtle inner glow that persists (base shape reference)
const innerGlow = {
  ddd: 0,
  ind: 3,
  ty: 4,
  nm: "Inner Glow",
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [
        { t: 0, s: [8], e: [18] },
        { t: 45, s: [18], e: [8] },
        { t: 90, s: [8] },
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
        {
          ty: "rc",
          d: 1,
          s: { a: 0, k: [baseW + 8, baseH + 8] },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: cornerR + 4 },
          nm: "Glow Rect",
        },
        {
          ty: "fl",
          c: { a: 0, k: GOLD },
          o: { a: 0, k: 20 },
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
      nm: "Inner Glow Group",
    },
  ],
  ip: 0,
  op: 90,
  st: 0,
};

const pulseRing = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 60,
  nm: "Pulse Ring",
  ddd: 0,
  assets: [],
  layers: [
    innerGlow,
    createRingLayer(0),
    createRingLayer(1),
    createRingLayer(2),
  ],
};

export default pulseRing;
