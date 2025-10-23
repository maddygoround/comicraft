import { ComicStyleName, ColorPalette, BorderStyle } from '../types';

export const STORY_MIN_LENGTH = 100;
export const STORY_MAX_LENGTH = 10000;
export const MAX_PANELS = 12;

export const STYLE_OPTIONS: { name: 'Style'; key: 'style'; values: ComicStyleName[] } = {
  name: 'Style',
  key: 'style',
  values: [
    ComicStyleName.ComicBook,
    ComicStyleName.Manga,
    ComicStyleName.Cartoon,
    ComicStyleName.Realistic,
  ],
};

export const PALETTE_OPTIONS: { name: 'Palette'; key: 'palette'; values: ColorPalette[] } = {
  name: 'Palette',
  key: 'palette',
  values: [
    ColorPalette.Vibrant,
    ColorPalette.Muted,
    ColorPalette.BlackAndWhite,
    ColorPalette.Pastel,
  ],
};

export const BORDER_OPTIONS: { name: 'Border'; key: 'border'; values: BorderStyle[] } = {
  name: 'Border',
  key: 'border',
  values: [BorderStyle.Sharp, BorderStyle.Rounded, BorderStyle.Thick, BorderStyle.None],
};
