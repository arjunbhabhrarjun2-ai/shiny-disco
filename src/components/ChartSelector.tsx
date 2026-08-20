'use client';

import React from 'react';

interface ChartSelectorProps {
  assets: string[];
  selectedAsset: string;
  onSelect: (asset: string) => void;
}

export default function ChartSelector({ assets, selectedAsset, onSelect }: ChartSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {assets.map((asset) => (
        <button
          key={asset}
          onClick={() => onSelect(asset)}
          className="px-3 py-1 rounded-md text-sm font-medium transition-all duration-200"
          style={
            selectedAsset === asset
              ? { background: '#3B82F6', color: '#fff' }
              : {
                  background: 'rgba(255,255,255,0.05)',
                  color: '#9CA3AF',
                  border: '1px solid rgba(255,255,255,0.06)',
                }
          }
          onMouseEnter={(e) => {
            if (selectedAsset !== asset) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(59,130,246,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = '#60A5FA';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedAsset !== asset) {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF';
            }
          }}
        >
          {asset}
        </button>
      ))}
    </div>
  );
}
