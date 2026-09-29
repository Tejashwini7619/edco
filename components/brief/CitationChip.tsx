'use client';

import React from 'react';
import { SourceMemory } from '@/lib/types';

interface CitationChipProps {
  id: string;
  index?: number;
  source?: SourceMemory;
  onClick?: (source: SourceMemory) => void;
}

export const CitationChip: React.FC<CitationChipProps> = ({ id, index, source, onClick }) => {
  const displayLabel = index !== undefined ? `${index}` : id.replace(/^cit-/, '');

  return (
    <button
      type="button"
      onClick={() => source && onClick && onClick(source)}
      className="inline-flex items-center justify-center ml-1 px-1.5 py-0.5 text-[10px] font-mono font-medium rounded border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:border-sky-500/60 transition-all cursor-pointer align-baseline"
      title={source ? `${source.context || 'Memory'} • ${source.timestamp ? new Date(source.timestamp).toLocaleDateString() : ''}` : 'Click to inspect memory'}
    >
      [{displayLabel}]
    </button>
  );
};
