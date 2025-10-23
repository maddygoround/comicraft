export interface CharacterPhoto {
  id: string;
  url: string;
  file?: File; // Optional for AI-generated images
}

export interface Character {
  id: string;
  name: string;
  photos: CharacterPhoto[];
}

export enum ComicStyleName {
  ComicBook = 'Comic Book',
  Manga = 'Manga',
  Cartoon = 'Cartoon',
  Realistic = 'Realistic',
  Watercolor = 'Watercolor',
  Retro = 'Retro',
}

export enum ColorPalette {
  Vibrant = 'Vibrant',
  Muted = 'Muted',
  BlackAndWhite = 'Black & White',
  Neon = 'Neon',
  Pastel = 'Pastel',
}

export enum BorderStyle {
  Sharp = 'Sharp',
  Rounded = 'Rounded',
  None = 'No Borders',
  Thick = 'Thick Outlines',
}

export interface ComicStyle {
  style: ComicStyleName;
  palette: ColorPalette;
  border: BorderStyle;
}

export interface PanelCharacter {
  name: string;
  dialogue: string;
}

export interface ComicPanel {
  panelNumber: number;
  narration: string;
  characters: PanelCharacter[];
  generatedImage: string; // Will hold the base64 URL of the generated panel image
}
