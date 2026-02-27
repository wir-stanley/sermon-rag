// Page turn: single page flipping with gold edge highlight (plays once)
const pageTurn = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 25,
  w: 40,
  h: 50,
  nm: "Page Turn",
  ddd: 0,
  assets: [],
  layers: [
    // Background page (static, the page revealed underneath)
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Back Page",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [60] }, { t: 10, s: [60] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [20, 25, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [28, 38] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 1 }, nm: "Page" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 30 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 5 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Back Page Group",
        },
        // Text lines on back page
        ...Array.from({ length: 5 }, (_, i) => ({
          ty: "gr" as const,
          it: [
            { ty: "rc" as const, d: 1, s: { a: 0, k: [18 - i * 2, 1] }, p: { a: 0, k: [0, -12 + i * 6] }, r: { a: 0, k: 0.5 }, nm: `Line ${i}` },
            { ty: "fl" as const, c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 20 }, r: 1, nm: "Fill" },
            { ty: "tr" as const, p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: `Text Line ${i}`,
        })),
      ],
      ip: 0,
      op: 25,
      st: 0,
    },
    // Turning page (simulated Y-axis flip via scaleX compression)
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Turning Page",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [100] }, { t: 18, s: [100], e: [40] }, { t: 25, s: [40] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [20, 25, 0] },
        a: { a: 0, k: [0, 0, 0] },
        // scaleX goes from 100 -> 0 -> -80 (simulates page flipping past midpoint)
        s: { a: 1, k: [
          { t: 0, s: [100, 100, 100], e: [20, 100, 100] },
          { t: 10, s: [20, 100, 100], e: [0, 100, 100] },
          { t: 13, s: [0, 100, 100], e: [-60, 102, 100] },
          { t: 20, s: [-60, 102, 100], e: [-80, 100, 100] },
          { t: 25, s: [-80, 100, 100] },
        ]},
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [28, 38] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 1 }, nm: "Page" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 8 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Turning Page Group",
        },
      ],
      ip: 0,
      op: 25,
      st: 0,
    },
    // Gold edge highlight – vertical line that sweeps across during flip
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Gold Edge",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0], e: [0] }, { t: 5, s: [0], e: [90] }, { t: 12, s: [90], e: [100] }, { t: 16, s: [100], e: [0] }, { t: 22, s: [0] }] },
        r: { a: 0, k: [0] },
        // Edge moves from right to left as page flips
        p: { a: 1, k: [
          { t: 5, s: [30, 25, 0], e: [20, 25, 0] },
          { t: 13, s: [20, 25, 0], e: [10, 25, 0] },
          { t: 22, s: [10, 25, 0] },
        ]},
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
                  v: [[0, -19], [0, 19]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "Edge Line",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Gold Edge Group",
        },
      ],
      ip: 0,
      op: 25,
      st: 0,
    },
    // Secondary glow line on edge (softer, wider)
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Edge Glow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: 6, s: [0], e: [50] }, { t: 12, s: [50], e: [60] }, { t: 16, s: [60], e: [0] }, { t: 22, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 1, k: [
          { t: 5, s: [30, 25, 0], e: [20, 25, 0] },
          { t: 13, s: [20, 25, 0], e: [10, 25, 0] },
          { t: 22, s: [10, 25, 0] },
        ]},
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [4, 38] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 1 }, nm: "Glow" },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 25 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Edge Glow Group",
        },
      ],
      ip: 0,
      op: 25,
      st: 0,
    },
    // Small sparkle particles along the edge during flip
    ...Array.from({ length: 4 }, (_, i) => {
      const yPos = 12 + i * 8;
      const startFrame = 8 + i * 2;
      return {
        ddd: 0,
        ind: 4 + i,
        ty: 4,
        nm: `Edge Sparkle ${i}`,
        sr: 1,
        ks: {
          o: { a: 1, k: [
            { t: startFrame, s: [0], e: [80] },
            { t: startFrame + 3, s: [80], e: [0] },
            { t: startFrame + 8, s: [0] },
          ]},
          r: { a: 0, k: [0] },
          p: { a: 1, k: [
            { t: startFrame, s: [20, yPos, 0], e: [20 + (i % 2 === 0 ? 3 : -3), yPos - 2, 0] },
            { t: startFrame + 8, s: [20 + (i % 2 === 0 ? 3 : -3), yPos - 2, 0] },
          ]},
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [
            { t: startFrame, s: [100, 100, 100], e: [50, 50, 100] },
            { t: startFrame + 8, s: [50, 50, 100] },
          ]},
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [2, 2] }, p: { a: 0, k: [0, 0] }, nm: "Spark" },
              { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
            nm: `Sparkle Group ${i}`,
          },
        ],
        ip: startFrame,
        op: 25,
        st: startFrame,
      };
    }),
  ],
};

export default pageTurn;
