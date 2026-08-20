'use client';

import React from 'react';

interface TimeframeSelectorProps {
  timeframes: string[];
  selectedTimeframe: string;
  onSelect: (timeframe: string) => void;
}

export default function TimeframeSelector({
  timeframes,
  selectedTimeframe,
  onSelect,
}: TimeframeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => onSelect(timeframe)}
          className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-200"
          style={
            selectedTimeframe === timeframe
              ? { background: '#3B82F6', color: '#fff' }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  color: '#9CA3AF',
                  border: '1px solid rgba(255,255,255,0.06)',
                }
          }
          onMouseEnter={(e) => {
            if (selectedTimeframe !== timeframe) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = '#60A5FA';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedTimeframe !== timeframe) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF';
            }
          }}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}
