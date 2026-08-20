"use client";
import React, { useEffect, useState } from "react";

interface ProgressCircleProps {
  label: string;
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function ProgressCircle({
  label,
  percent,
  size = 80,
  strokeWidth = 4,
  color = "#3B82F6",
}: ProgressCircleProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(percent), 100);
    return () => clearTimeout(timeout);
  }, [percent]);

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white">
          {progress}%
        </div>
      </div>
      <p className="mt-2 text-xs" style={{ color: '#6B7280' }}>{label}</p>
    </div>
  );
}
