/**
 * AI Service Types and Interfaces
 * Provides type definitions for all AI-related services
 */

import type { ComicPanel, Character, ComicStyle, PanelCharacter } from '../../types';

/**
 * Base AI Provider Configuration
 */
export interface AIProviderConfig {
  apiKey?: string;
  project?: string;
  location?: string;
  vertexai?: boolean;
}

/**
 * AI Generation Progress Callback (string status)
 */
export type AIProgressCallback = (status: string) => void;

/**
 * AI Generation Progress Callback (numeric progress)
 */
export type AIProgressNumericCallback = (current: number, total: number) => void;

/**
 * Character Extraction Request
 */
export interface AICharacterExtractionRequest {
  storyText: string;
}

/**
 * Character Extraction Response
 */
export interface AICharacterExtractionResponse {
  characters: string[];
}

/**
 * Character Image Generation Request
 */
export interface AICharacterImageRequest {
  characterName: string;
  description?: string;
}

/**
 * Character Image Generation Response
 */
export interface AICharacterImageResponse {
  imageUrl: string;
}

/**
 * Comic Panel Generation Request
 */
export interface AIComicPanelRequest {
  storyText: string;
  characters: Character[];
  style: ComicStyle;
  onProgress?: AIProgressNumericCallback;
}

/**
 * Comic Panel Generation Response
 */
export interface AIComicPanelResponse {
  panels: ComicPanel[];
}

/**
 * Video Generation Request
 */
export interface AIVideoGenerationRequest {
  panelImage: string;
  narration: string;
  characters: PanelCharacter[];
  onProgress?: AIProgressCallback;
}

/**
 * Video Generation Response
 */
export interface AIVideoGenerationResponse {
  videoUrl: string;
}

/**
 * Video Download Request
 */
export interface AIVideoDownloadRequest {
  videoUrl: string;
  filename: string;
}

/**
 * Base AI Provider Interface
 */
export interface IAIProvider {
  /**
   * Provider name
   */
  readonly name: string;

  /**
   * Initialize the provider
   */
  initialize(config: AIProviderConfig): Promise<void>;

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean;
}

/**
 * Character AI Service Interface
 */
export interface IAICharacterService extends IAIProvider {
  /**
   * Extract characters from story text
   */
  extractCharacters(request: AICharacterExtractionRequest): Promise<AICharacterExtractionResponse>;

  /**
   * Generate character image
   */
  generateCharacterImage(request: AICharacterImageRequest): Promise<AICharacterImageResponse>;
}

/**
 * Comic AI Service Interface
 */
export interface IAIComicService extends IAIProvider {
  /**
   * Generate comic panels from story
   */
  generateComicPanels(request: AIComicPanelRequest): Promise<AIComicPanelResponse>;
}

/**
 * Video AI Service Interface
 */
export interface IAIVideoService extends IAIProvider {
  /**
   * Generate video from comic panel
   */
  generateVideo(request: AIVideoGenerationRequest): Promise<AIVideoGenerationResponse>;

  /**
   * Download video to disk
   */
  downloadVideo(request: AIVideoDownloadRequest): Promise<void>;
}
