"use client";

import { useRef, useState } from "react";
import useSmoothStroke from "./useSmoothStroke";

export default function InkCanvas() {
  const svgRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [current, setCurrent] = useState([]);

  const { smooth } = useSmoothStroke();

  const handlePointerDown = (e) => {
    setCurrent([[e.nativeEvent.offsetX, e.nativeEvent.offsetY]]);
  };

  const handlePointerMove = (e) => {
    if (!current.length) return;

    const newPoint = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    const updated = [...current, newPoint];

    setCurrent(updated);
  };

  const handlePointerUp = () => {
    const smoothed = smooth(current);
    setPaths((prev) => [...prev, smoothed]);
    setCurrent([]);
  };

  const pathToD = (points) => {
    if (!points.length) return "";
    return points.reduce(
      (acc, [x, y], i) =>
        i === 0 ? `M ${x} ${y}` : acc + ` L ${x} ${y}`,
      ""
    );
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="300"
      className="bg-transparent cursor-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {paths.map((p, i) => (
        <path
          key={i}
          d={pathToD(p)}
          stroke="#1a1a1a"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      {current.length > 0 && (
        <path
          d={pathToD(current)}
          stroke="#333"
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  );
}
