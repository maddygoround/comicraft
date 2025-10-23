'use client';

import React from 'react';
import { Wand2, Palette } from 'lucide-react';
import { ComicStyle, ComicStyleName, ColorPalette, BorderStyle } from '../types';
import { STYLE_OPTIONS, PALETTE_OPTIONS, BORDER_OPTIONS } from '../constants';

interface StyleSelectorProps {
  style: ComicStyle;
  onStyleChange: (style: ComicStyle) => void;
  onNext: () => void;
  onBack: () => void;
}

interface StyleOptionGroupProps {
  name: string;
  values: (ComicStyleName | ColorPalette | BorderStyle)[];
  selected: ComicStyleName | ColorPalette | BorderStyle;
  onSelect: (value: ComicStyleName | ColorPalette | BorderStyle) => void;
}

const StyleOptionGroup: React.FC<StyleOptionGroupProps> = ({
  name,
  values,
  selected,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-display text-secondary">{name}</h3>
      <div className="grid grid-cols-2 gap-4">
        {values.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option as any)}
            className={`p-4 rounded-lg font-bold transition-all duration-200 border-2 border-black ${
              selected === option
                ? 'bg-primary text-text-light shadow-pop-out-dark transform -translate-y-1'
                : 'bg-background-dark text-text-dark shadow-pop-out hover:-translate-y-0.5'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  style,
  onStyleChange,
  onNext,
  onBack,
}) => {
  const handleStyleChange = (key: keyof ComicStyle, value: ComicStyleName | ColorPalette | BorderStyle) => {
    onStyleChange({ ...style, [key]: value });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-lg border-2 border-black shadow-pop-out-dark">
            <Wand2 className="text-white" size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-6xl md:text-7xl font-display text-primary text-shadow-comic-lg tracking-wider">
            CHOOSE STYLE!
          </h2>
          <p className="text-xl text-text-dark/80 font-medium max-w-2xl mx-auto">
            Select the visual style for your comic book
          </p>
        </div>

        {/* Style Options */}
        <div className="space-y-8">
          <StyleOptionGroup
            name={STYLE_OPTIONS.name}
            values={STYLE_OPTIONS.values}
            selected={style.style}
            onSelect={(value) => handleStyleChange('style', value as ComicStyleName)}
          />

          <StyleOptionGroup
            name={PALETTE_OPTIONS.name}
            values={PALETTE_OPTIONS.values}
            selected={style.palette}
            onSelect={(value) => handleStyleChange('palette', value as ColorPalette)}
          />

          <StyleOptionGroup
            name={BORDER_OPTIONS.name}
            values={BORDER_OPTIONS.values}
            selected={style.border}
            onSelect={(value) => handleStyleChange('border', value as BorderStyle)}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gray-700 text-white rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-12 py-4 bg-primary text-text-light rounded-lg border-2 border-black font-bold text-xl shadow-pop-out-dark hover:-translate-y-1 transition-all duration-200"
          >
            Generate Comic
          </button>
        </div>
    </div>
  );
};
