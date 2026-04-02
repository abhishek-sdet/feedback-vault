export default function useSmoothStroke() {
  const smooth = (points) => {
    if (points.length < 3) return points;

    const smoothed = [];

    for (let i = 1; i < points.length - 1; i++) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];

      const cx = (x0 + x1 + x2) / 3;
      const cy = (y0 + y1 + y2) / 3;

      smoothed.push([cx, cy]);
    }

    return smoothed;
  };

  return { smooth };
}
