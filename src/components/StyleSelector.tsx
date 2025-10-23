'use client';

import React from 'react';
import { Wand2, Eye, Palette, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
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
      <h3 className="text-lg font-semibold text-white mb-4">{name}</h3>
      <div className="grid grid-cols-2 gap-3">
        {values.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option as any)}
            className={`p-4 rounded-xl font-medium transition-all duration-300 ${selected === option
                ? 'bg-gradient-to-r from-[#B7A3E3] via-[#FF8F8F] to-[#C2E2FA] text-white shadow-lg shadow-[#B7A3E3]/50 border-2 border-transparent'
                : 'glass border-2 border-white/10 hover:border-[#B7A3E3]/50 text-gray-300 hover:text-white'
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
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center text-white shadow-lg shadow-[#B7A3E3]/50">
            <Wand2 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Style</h1>
            <p className="text-gray-300 text-lg">
              Select the visual style for your comic
            </p>
          </div>
        </div>

        {/* Style Options */}
        <div className="space-y-8 flex-1">
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
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 glass border border-white/10 text-gray-300 hover:text-white hover:border-white/20 rounded-xl transition-all duration-300"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-[#C2E2FA] to-[#B7A3E3] hover:from-[#C2E2FA]/80 hover:to-[#B7A3E3]/80 text-gray-800 font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Generate Comic
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Style Preview */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B7A3E3] to-[#FF8F8F] flex items-center justify-center">
              <Eye className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">Style Preview</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Style:</span>
              <span className="text-[#C2E2FA] font-medium">{style.style}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Palette:</span>
              <span className="text-[#FFF1CB] font-medium">{style.palette}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Border:</span>
              <span className="text-[#B7A3E3] font-medium">{style.border}</span>
            </div>
          </div>
        </Card>

        {/* Style Tips */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C2E2FA] to-[#B7A3E3] flex items-center justify-center">
              <Palette className="text-white" size={16} />
            </div>
            <h3 className="text-lg font-semibold text-white">Style Tips</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#B7A3E3] rounded-full mt-2 shrink-0"></div>
              <span>Comic Book style works great for action scenes</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#FF8F8F] rounded-full mt-2 shrink-0"></div>
              <span>Manga style is perfect for emotional stories</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#C2E2FA] rounded-full mt-2 shrink-0"></div>
              <span>Cartoon style is great for humor and family stories</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFF1CB] rounded-full mt-2 shrink-0"></div>
              <span>Realistic style works well for dramatic stories</span>
            </li>
          </ul>
        </Card>

        {/* Generate Button */}
        <Card>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C2E2FA] to-[#B7A3E3] flex items-center justify-center mx-auto mb-4">
              <Wand2 className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to Generate?</h3>
            <p className="text-sm text-gray-300 mb-6">
              Your comic will be created with the selected style
            </p>
            <button
              onClick={onNext}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#B7A3E3] to-[#FF8F8F] hover:from-[#B7A3E3]/80 hover:to-[#FF8F8F]/80 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Generate Comic
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
