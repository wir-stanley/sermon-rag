// Shield crest: Reformed shield with inner cross and pulsing glow
const shieldCrest = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 32,
  h: 32,
  nm: "Shield Crest",
  ddd: 0,
  assets: [],
  layers: [
    // Pulsing glow behind the shield
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [15], e: [35] }, { t: 45, s: [35], e: [15] }, { t: 90, s: [15] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [16, 17, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [130, 130, 100] }, { t: 45, s: [130, 130, 100], e: [100, 100, 100] }, { t: 90, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [26, 26] }, p: { a: 0, k: [0, 0] }, nm: "Glow Circle" },
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
    // Shield body (pentagon-like shape)
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shield",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [80], e: [100] }, { t: 45, s: [100], e: [80] }, { t: 90, s: [80] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [16, 17, 0] },
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
                  c: true,
                  // Shield shape: flat top, curving sides meeting at a bottom point
                  v: [[-10, -10], [10, -10], [10, 2], [0, 12], [-10, 2]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "Shield Path",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.2 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 10 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Shield Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Inner cross on the shield
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Cross",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [70], e: [100] }, { t: 45, s: [100], e: [70] }, { t: 90, s: [70] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [16, 16, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        // Vertical bar of cross
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [2, 12] }, p: { a: 0, k: [0, 1] }, r: { a: 0, k: 0.5 }, nm: "V Bar" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Vertical Bar",
        },
        // Horizontal bar of cross
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [10, 2] }, p: { a: 0, k: [0, -2] }, r: { a: 0, k: 0.5 }, nm: "H Bar" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Horizontal Bar",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Inner glow pulse – smaller circle inside the shield
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Inner Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [25] }, { t: 22, s: [25], e: [0] }, { t: 45, s: [0], e: [25] }, { t: 67, s: [25], e: [0] }, { t: 90, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [16, 16, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [80, 80, 100], e: [110, 110, 100] }, { t: 22, s: [110, 110, 100], e: [80, 80, 100] }, { t: 45, s: [80, 80, 100], e: [110, 110, 100] }, { t: 67, s: [110, 110, 100], e: [80, 80, 100] }, { t: 90, s: [80, 80, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [14, 14] }, p: { a: 0, k: [0, 0] }, nm: "Inner Glow" },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 30 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Inner Glow Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    // Shield top accent line
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Top Accent",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [40], e: [70] }, { t: 45, s: [70], e: [40] }, { t: 90, s: [40] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [16, 7, 0] },
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
                  c: false,
                  v: [[-9, 0], [9, 0]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "Top Line",
            },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 60 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Top Accent Group",
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
  ],
};

export default shieldCrest;
