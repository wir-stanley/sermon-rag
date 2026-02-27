// Send arrow: arrow that launches upward (plays once)
const sendArrow = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 20,
  w: 24,
  h: 24,
  nm: "Send Arrow",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 0,
      ty: 4,
      nm: "Arrow",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [100], e: [100] }, { t: 12, s: [100], e: [0] }, { t: 20, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 1, k: [{ t: 0, s: [12, 14, 0], e: [12, 4, 0] }, { t: 15, s: [12, 4, 0] }] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [{ t: 0, s: [100, 100, 100], e: [80, 120, 100] }, { t: 10, s: [80, 120, 100] }] },
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
                  v: [[0, 4], [0, -4], [-3, -1]],
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]],
                },
              },
              nm: "Arrow Path 1",
            },
            {
              ty: "sh",
              d: 1,
              ks: {
                a: 0,
                k: {
                  c: false,
                  v: [[0, -4], [3, -1]],
                  i: [[0, 0], [0, 0]],
                  o: [[0, 0], [0, 0]],
                },
              },
              nm: "Arrow Path 2",
            },
            { ty: "st", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 1.5 }, lc: 2, lj: 2, nm: "Stroke" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Arrow Group",
        },
      ],
      ip: 0,
      op: 20,
      st: 0,
    },
    // Trail
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Trail",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 3, s: [0], e: [50] }, { t: 8, s: [50], e: [0] }, { t: 18, s: [0] }] },
        r: { a: 0, k: [0] },
        p: { a: 0, k: [12, 16, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "rc", d: 1, s: { a: 0, k: [1.5, 8] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0.5 }, nm: "Trail" },
            { ty: "fl", c: { a: 0, k: [0.83, 0.63, 0.07, 1] }, o: { a: 0, k: 40 }, r: 1, nm: "Fill" },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
          nm: "Trail Group",
        },
      ],
      ip: 0,
      op: 20,
      st: 0,
    },
  ],
};

export default sendArrow;
