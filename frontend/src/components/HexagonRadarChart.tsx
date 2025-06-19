"use client";

import { useMemo } from "react";
import type { CharacterAttributes } from "@/lib/character-engine";

interface HexagonRadarChartProps {
  attributes: CharacterAttributes;
  size?: number;
  className?: string;
}

export function HexagonRadarChart({ 
  attributes, 
  size = 200, 
  className = "" 
}: HexagonRadarChartProps) {
  const padding = 60; // Extra padding for labels
  const chartSize = size - padding * 2; // Inner chart size
  const center = size / 2; // Center of the full SVG
  const maxRadius = chartSize / 2; // Radius within the inner area
  
  // Define the 6 attributes and their positions (starting from top, clockwise)
  const attributeConfig = [
    { key: 'wisdom' as keyof CharacterAttributes, label: '智慧', emoji: '🧠', angle: -90 },
    { key: 'adventure' as keyof CharacterAttributes, label: '冒險', emoji: '🧭', angle: -30 },
    { key: 'aesthetic' as keyof CharacterAttributes, label: '美感', emoji: '🎨', angle: 30 },
    { key: 'social' as keyof CharacterAttributes, label: '社交', emoji: '👥', angle: 90 },
    { key: 'greed' as keyof CharacterAttributes, label: '貪婪', emoji: '🪙', angle: 150 },
    { key: 'stability' as keyof CharacterAttributes, label: '穩定', emoji: '🔒', angle: -150 },
  ];
  
  // Generate hexagon grid lines (5 levels)
  const gridLevels = [1, 2, 3, 4, 5];
  
  // Calculate points for hexagon at each grid level
  const getHexagonPoints = (level: number) => {
    const radius = (maxRadius * level) / 5;
    return attributeConfig.map(({ angle }) => {
      const radian = (angle * Math.PI) / 180;
      const x = center + radius * Math.cos(radian);
      const y = center + radius * Math.sin(radian);
      return `${x},${y}`;
    }).join(' ');
  };
  
  // Calculate data polygon points
  const dataPoints = useMemo(() => {
    return attributeConfig.map(({ key, angle }) => {
      const value = attributes[key];
      const radius = (maxRadius * value) / 5;
      const radian = (angle * Math.PI) / 180;
      const x = center + radius * Math.cos(radian);
      const y = center + radius * Math.sin(radian);
      return { x, y, value, key };
    });
  }, [attributes, center, maxRadius]);
  
  const dataPolygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
  
  // Calculate label positions (outside the hexagon)
  const labelPositions = attributeConfig.map(({ angle, label, emoji }) => {
    const labelRadius = maxRadius + 30; // Distance from chart edge
    const radian = (angle * Math.PI) / 180;
    const x = center + labelRadius * Math.cos(radian);
    const y = center + labelRadius * Math.sin(radian);
    
    // Adjust text anchor based on position
    let textAnchor: "start" | "middle" | "end" = "middle";
    if (x < center - 10) textAnchor = "end";
    else if (x > center + 10) textAnchor = "start";
    
    return { x, y, label, emoji, textAnchor, angle };
  });
  
  return (
    <div className={`flex flex-col items-center relative ${className}`}>
      <div style={{ width: size, height: size }} className="relative">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Grid lines */}
          {gridLevels.map((level) => (
            <polygon
              key={`grid-${level}`}
              points={getHexagonPoints(level)}
              fill="none"
              stroke={level === 5 ? "#374151" : "#e5e7eb"}
              strokeWidth={level === 5 ? 2 : 1}
              className="opacity-50"
            />
          ))}
          
          {/* Axis lines */}
          {attributeConfig.map(({ angle }, index) => {
            const radian = (angle * Math.PI) / 180;
            const x = center + maxRadius * Math.cos(radian);
            const y = center + maxRadius * Math.sin(radian);
            return (
              <line
                key={`axis-${index}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#d1d5db"
                strokeWidth={1}
                className="opacity-40"
              />
            );
          })}
          
          {/* Data area */}
          <polygon
            points={dataPolygonPoints}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth={2}
            className="opacity-80"
          />
          
          {/* Data points */}
          {dataPoints.map(({ x, y, value }, index) => (
            <g key={`point-${index}`}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth={2}
              />
              {value > 0 && (
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-slate-700"
                >
                  {value}
                </text>
              )}
            </g>
          ))}
          
          {/* Center point */}
          <circle
            cx={center}
            cy={center}
            r={3}
            fill="#6b7280"
            className="opacity-60"
          />
          
          {/* Labels */}
          {labelPositions.map(({ x, y, label, emoji, textAnchor }, index) => (
            <text
              key={`label-${index}`}
              x={x}
              y={y + 4}
              textAnchor={textAnchor}
              className="text-sm font-medium fill-slate-600"
              dominantBaseline="middle"
            >
              {emoji} {label}
            </text>
          ))}
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-center">
        <div className="text-xs text-slate-500">
          屬性等級 (0-5)
        </div>
      </div>
    </div>
  );
}