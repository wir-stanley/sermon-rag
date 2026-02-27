// Chain links: two gold links connecting with sparkle (plays once)
const chainLinks = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 30,
  w: 60,
  h: 30,
  nm: "Chain Links",
  ddd: 0,
  assets: [],
  layers: [
    // Left chain link – slides right to meet
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Left Link",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [60], e: [100] }, { t: 12, s: [100] }] },
        r: { a: 0, k: [0] },
        p: { a: 1, k: [{ t: 0, s: [16, 15, 0], e: [22, 15, 0] }, { t: 12, s: [22, 15, 0] }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [18, 12] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 5 }, nm: "Link Body" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Left Link Group",
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
    },
    // Right chain link – slides left to meet
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Right Link",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [60], e: [100] }, { t: 12, s: [100] }] },
        r: { a: 0, k: [0] },
        p: { a: 1, k: [{ t: 0, s: [44, 15, 0], e: [38, 15, 0] }, { t: 12, s: [38, 15, 0] }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [18, 12] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 5 }, nm: "Link Body" },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Right Link Group",
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
    },
    // Join connector – small bar that appears when links connect
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Join Bar",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [0] }, { t: 11, s: [0], e: [80] }, { t: 15, s: [80] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [30, 15, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [4, 10] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 2 }, nm: "Bar" },
            { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 60 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Join Bar Group",
        },
      ],
      ip: 0,
      op: 30,
      st: 0,
    },
    // Sparkle particles at join point
    ...Array.from({ length: 6 }, (_, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      const dist = 6 + i * 2;
      const endX = 30 + Math.cos(angle) * dist;
      const endY = 15 + Math.sin(angle) * dist;
      return {
        ddd: 0,
        ind: 3 + i,
        ty: 4,
        nm: `Sparkle ${i}`,
        sr: 1,
        ks: {
          o: { a: 1, k: [{ t: 12, s: [0], e: [90] }, { t: 16, s: [90], e: [0] }, { t: 25, s: [0] }] },
          r: { a: 0, k: [0] },
          p: { a: 1, k: [{ t: 12, s: [30, 15, 0], e: [endX, endY, 0] }, { t: 25, s: [endX, endY, 0] }] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 1, k: [{ t: 12, s: [100, 100, 100], e: [50, 50, 100] }, { t: 25, s: [50, 50, 100] }] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              { ty: "el", d: 1, s: { a: 0, k: [2.5, 2.5] }, p: { a: 0, k: [0, 0] }, nm: "Spark" },
              { ty: "fl", c: { a: 0, k: [0.9, 0.73, 0.17, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill" },
              { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
            ],
            nm: `Sparkle Group ${i}`,
          },
        ],
        ip: 12,
        op: 30,
        st: 12,
      };
    }),
    // Center sparkle cross (star burst effect)
    {
      ddd: 0,
      ind: 9,
      ty: 4,
      nm: "Sparkle Cross",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 12, s: [0], e: [100] }, { t: 15, s: [100], e: [0] }, { t: 22, s: [0] }] },
        r: { a: 1, k: [{ t: 12, s: [0], e: [45] }, { t: 22, s: [45] }] },
        p: { a: 0, k: [30, 15, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 12, s: [50, 50, 100], e: [120, 120, 100] }, { t: 18, s: [120, 120, 100], e: [50, 50, 100] }, { t: 22, s: [50, 50, 100] }] },
      },
      ao: 0,
      shapes: [
        // Vertical sparkle line
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
                  v: [[0, -4], [0, 4]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "V Line",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "V Sparkle",
        },
        // Horizontal sparkle line
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
                  v: [[-4, 0], [4, 0]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "H Line",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "H Sparkle",
        },
      ],
      ip: 12,
      op: 30,
      st: 12,
    },
  ],
};

export default chainLinks;
