// Hourglass sand: gold hourglass with flowing sand particles and gentle rocking
const hourglassSand = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 40,
  h: 40,
  nm: "Hourglass Sand",
  ddd: 0,
  assets: [],
  layers: [
    // Entire hourglass group – gentle rocking rotation
    // Top frame triangle (opening downward)
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Top Frame",
      sr: 1,
      ks: {
        o: { a: 0, k: [90] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [4] }, { t: 30, s: [4], e: [0] }, { t: 60, s: [0], e: [-4] }, { t: 90, s: [-4], e: [0] }, { t: 120, s: [0] }] },
        p: { a: 0, k: [20, 20, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        // Top triangle (funnel shape, wider at top)
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
                  v: [[-10, -14], [10, -14], [2, -2], [-2, -2]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "Top Tri",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.2 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 8 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Top Triangle Group",
        },
        // Bottom triangle (funnel shape, wider at bottom)
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
                  v: [[-2, 2], [2, 2], [10, 14], [-10, 14]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "Bot Tri",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.2 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 8 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Bottom Triangle Group",
        },
        // Top cap line
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
                  v: [[-12, -14], [12, -14]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "Top Cap",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Top Cap Group",
        },
        // Bottom cap line
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
                  v: [[-12, 14], [12, 14]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "Bot Cap",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Bot Cap Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Sand level in top chamber (shrinks over time)
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Top Sand",
      sr: 1,
      ks: {
        o: { a: 0, k: [70] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [4] }, { t: 30, s: [4], e: [0] }, { t: 60, s: [0], e: [-4] }, { t: 90, s: [-4], e: [0] }, { t: 120, s: [0] }] },
        p: { a: 0, k: [20, 20, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [30, 30, 100] }, { t: 100, s: [30, 30, 100], e: [100, 100, 100] }, { t: 120, s: [100, 100, 100] }] },
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
                  v: [[-7, -10], [7, -10], [2, -4], [-2, -4]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "Top Sand Shape",
            },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 60 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Top Sand Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Sand level in bottom chamber (grows over time)
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Bottom Sand",
      sr: 1,
      ks: {
        o: { a: 0, k: [70] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [4] }, { t: 30, s: [4], e: [0] }, { t: 60, s: [0], e: [-4] }, { t: 90, s: [-4], e: [0] }, { t: 120, s: [0] }] },
        p: { a: 0, k: [20, 20, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [30, 30, 100], e: [100, 100, 100] }, { t: 100, s: [100, 100, 100], e: [30, 30, 100] }, { t: 120, s: [30, 30, 100] }] },
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
                  v: [[-2, 4], [2, 4], [7, 10], [-7, 10]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "Bottom Sand Shape",
            },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 60 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Bottom Sand Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Falling sand stream (thin line through the neck)
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Sand Stream",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [60], e: [80] }, { t: 30, s: [80], e: [60] }, { t: 60, s: [60], e: [80] }, { t: 90, s: [80], e: [60] }, { t: 120, s: [60] }] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [4] }, { t: 30, s: [4], e: [0] }, { t: 60, s: [0], e: [-4] }, { t: 90, s: [-4], e: [0] }, { t: 120, s: [0] }] },
        p: { a: 0, k: [20, 20, 0] },
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
                  v: [[0, -3], [0, 3]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "Stream",
            },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 70 }, w: { a: 0, k: 1 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Stream Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Sand particles falling from top to bottom (staggered)
    ...Array.from({ length: 8 }, (_, i) => {
      const offsetX = (i % 2 === 0 ? -1 : 1) * (0.5 + (i % 3) * 0.5);
      const cycleDelay = i * 14;
      const fallStart = cycleDelay % 120;
      const fallEnd = (fallStart + 30) % 120;
      return {
        ddd: 0,
        ind: 4 + i,
        ty: 4,
        nm: `Sand Particle ${i}`,
        sr: 1,
        ks: {
          o: { a: 1, k: [
            { t: fallStart, s: [0], e: [70] },
            { t: Math.min(fallStart + 8, 119), s: [70], e: [70] },
            { t: Math.min(fallStart + 22, 119), s: [70], e: [0] },
            { t: Math.min(fallStart + 30, 119), s: [0] },
          ]},
          r: { a: 0, k: [0] },
          p: { a: 1, k: [
            { t: fallStart, s: [20 + offsetX, 17, 0], e: [20 + offsetX * 1.5, 23, 0] },
            { t: Math.min(fallStart + 30, 119), s: [20 + offsetX * 1.5, 23, 0] },
          ]},
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [1.5, 1.5] }, p: { a: 0, k: [0, 0] }, nm: "Grain" },
              { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 80 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
            nm: `Grain Group ${i}`,
          },
        ],
        ip: 0,
        op: 120,
        st: 0,
      };
    }),
  ],
};

export default hourglassSand;
