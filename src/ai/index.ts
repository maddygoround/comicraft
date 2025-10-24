/**
 * AI Module - Public API
 * Main entry point for all AI services
 */

import { AIServiceFactory, AIServiceProvider } from './AIServiceFactory';
import type {
  AICharacterExtractionRequest,
  AICharacterImageRequest,
  AIComicPanelRequest,
  AIVideoGenerationRequest,
  AIVideoDownloadRequest,
  AIProgressCallback,
} from './types';
import type { Character, ComicPanel, ComicStyle } from '../types';

/**
 * Initialize AI services
 * Must be called before using any AI functions
 */
export const initializeAI = async (provider: AIServiceProvider = AIServiceProvider.GEMINI): Promise<void> => {
  await AIServiceFactory.initialize(provider);
};

/**
 * Extract characters from story text
 */
export const AIExtractCharacters = async (storyText: string): Promise<string[]> => {
  const service = AIServiceFactory.getCharacterService();
  const response = await service.extractCharacters({ storyText });
  return response.characters;
};

/**
 * Generate character image
 */
export const AIGenerateCharacterImage = async (
  characterName: string,
  description?: string
): Promise<string> => {
  const service = AIServiceFactory.getCharacterService();
  const response = await service.generateCharacterImage({ characterName, description });
  return response.imageUrl;
};

/**
 * Generate comic panels from story
 */
export const AIGenerateComicPanels = async (
  storyText: string,
  characters: Character[],
  style: ComicStyle,
  onProgress?: (current: number, total: number) => void
): Promise<ComicPanel[]> => {
  const service = AIServiceFactory.getComicService();
  const response = await service.generateComicPanels({
    storyText,
    characters,
    style,
    onProgress,
  });
  return response.panels;
};

/**
 * Generate video from comic panel
 */
export const AIGenerateVideo = async (
  panelImage: string,
  narration: string,
  characters: Array<{ name: string; dialogue: string }>,
  onProgress?: AIProgressCallback
): Promise<string> => {
  const service = AIServiceFactory.getVideoService();
  const response = await service.generateVideo({
    panelImage,
    narration,
    characters,
    onProgress,
  });
  return response.videoUrl;
};

/**
 * Download video to disk
 */
export const AIDownloadVideo = async (videoUrl: string, filename: string): Promise<void> => {
  const service = AIServiceFactory.getVideoService();
  await service.downloadVideo({ videoUrl, filename });
};

// Re-export types
export type { AIProgressCallback };
export { AIServiceProvider };
