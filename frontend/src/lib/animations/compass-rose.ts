// Compass rose: ornate compass with rotating inner ring and pulsing cardinal points
const compassRose = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 120,
  w: 80,
  h: 80,
  nm: "Compass Rose",
  ddd: 0,
  assets: [],
  layers: [
    // Outer ring – subtle pulsing scale
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Outer Ring",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [50], e: [70] }, { t: 60, s: [70], e: [50] }, { t: 120, s: [50] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [108, 108, 100] }, { t: 60, s: [108, 108, 100], e: [100, 100, 100] }, { t: 120, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [64, 64] }, p: { a: 0, k: [0, 0] }, nm: "Outer Circle" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 60 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Outer Ring Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Inner ring – continuous rotation
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Inner Ring",
      sr: 1,
      ks: {
        o: { a: 0, k: [70] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120, s: [360] }] },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [40, 40] }, p: { a: 0, k: [0, 0] }, nm: "Inner Circle" },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 1 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Inner Ring Group",
        },
        // Small tick marks on the inner ring to visualize rotation
        ...Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const r1 = 17;
          const r2 = 20;
          const x1 = Math.cos(angle) * r1;
          const y1 = Math.sin(angle) * r1;
          const x2 = Math.cos(angle) * r2;
          const y2 = Math.sin(angle) * r2;
          return {
            ty: "gr" as const,
            it: [
              {
                ty: "sh" as const,
                d: 1,
                ks: {
                  a: 0,
                  k: {
                    c: false,
                    v: [[x1, y1], [x2, y2]],
                    i: [[0, 0], [0, 0]],
                    o: [[0, 0], [0, 0]],
                  },
                },
                nm: `Tick ${i}`,
              },
              { ty: "st" as const, c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 40 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
              { ty: "tr" as const, p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
            nm: `Tick Group ${i}`,
          };
        }),
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Central dot
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Center Dot",
      sr: 1,
      ks: {
        o: { a: 0, k: [90] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "el", d: 1, s: { a: 0, k: [6, 6] }, p: { a: 0, k: [0, 0] }, nm: "Dot" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Center Dot Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Cardinal point: North – diamond pointing up
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "North Point",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [80], e: [100] }, { t: 30, s: [100], e: [80] }, { t: 60, s: [80], e: [100] }, { t: 90, s: [100], e: [80] }, { t: 120, s: [80] }] },
        r: { a: 1, k: [{ t: 0, s: [0], e: [360] }, { t: 120, s: [360] }] },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [110, 110, 100] }, { t: 30, s: [110, 110, 100], e: [100, 100, 100] }, { t: 60, s: [100, 100, 100], e: [110, 110, 100] }, { t: 90, s: [110, 110, 100], e: [100, 100, 100] }, { t: 120, s: [100, 100, 100] }] },
      },
      ao: 0,
      shapes: [
        // North diamond
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
                  v: [[0, -28], [4, -18], [0, -12], [-4, -18]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "N Diamond",
            },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 90 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "North Group",
        },
        // South diamond
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
                  v: [[0, 28], [4, 18], [0, 12], [-4, 18]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "S Diamond",
            },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "South Group",
        },
        // East diamond
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
                  v: [[28, 0], [18, 4], [12, 0], [18, -4]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "E Diamond",
            },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "East Group",
        },
        // West diamond
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
                  v: [[-28, 0], [-18, 4], [-12, 0], [-18, -4]],
                  i: [[0, 0], [0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "W Diamond",
            },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 70 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "West Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
    // Intercardinal lines (diagonal accents – NE, SE, SW, NW)
    {
      ddd: 0,
      ind: 4,
      ty: 4,
      nm: "Intercardinal Lines",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [30], e: [50] }, { t: 60, s: [50], e: [30] }, { t: 120, s: [30] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [40, 40, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        // NE line
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
                  v: [[8, -8], [20, -20]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "NE",
            },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "NE Group",
        },
        // SE line
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
                  v: [[8, 8], [20, 20]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "SE",
            },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "SE Group",
        },
        // SW line
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
                  v: [[-8, 8], [-20, 20]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "SW",
            },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "SW Group",
        },
        // NW line
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
                  v: [[-8, -8], [-20, -20]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "NW",
            },
            { ty: "st", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 50 }, w: { a: 0, k: 0.8 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "NW Group",
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
};

export default compassRose;
