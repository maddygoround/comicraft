/**
 * AI Service Factory
 * Central factory for creating and managing AI service instances
 */

import { AIGeminiCharacterService } from './providers/gemini/AIGeminiCharacterService';
import { AIGeminiComicService } from './providers/gemini/AIGeminiComicService';
import { AIGeminiVideoService } from './providers/gemini/AIGeminiVideoService';
import type {
  AIProviderConfig,
  IAICharacterService,
  IAIComicService,
  IAIVideoService,
} from './types';

/**
 * AI Service Provider Types
 */
export enum AIServiceProvider {
  GEMINI = 'gemini',
}

/**
 * AI Service Factory Class
 * Singleton factory for managing AI service instances
 */
class AIServiceFactoryClass {
  private static instance: AIServiceFactoryClass;
  private characterService?: IAICharacterService;
  private comicService?: IAIComicService;
  private videoService?: IAIVideoService;
  private initialized: boolean = false;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AIServiceFactoryClass {
    if (!AIServiceFactoryClass.instance) {
      AIServiceFactoryClass.instance = new AIServiceFactoryClass();
    }
    return AIServiceFactoryClass.instance;
  }

  /**
   * Initialize all AI services
   */
  async initialize(provider: AIServiceProvider = AIServiceProvider.GEMINI): Promise<void> {
    if (this.initialized) {
      return;
    }

    const config: AIProviderConfig = {
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string,
    };

    switch (provider) {
      case AIServiceProvider.GEMINI:
        this.characterService = new AIGeminiCharacterService();
        this.comicService = new AIGeminiComicService();
        this.videoService = new AIGeminiVideoService();
        break;
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    // Initialize all services
    await Promise.all([
      this.characterService.initialize(config),
      this.comicService.initialize(config),
      this.videoService.initialize(config),
    ]);

    this.initialized = true;
  }

  /**
   * Get Character AI Service
   */
  getCharacterService(): IAICharacterService {
    if (!this.characterService) {
      throw new Error('AI services not initialized. Call initialize() first.');
    }
    return this.characterService;
  }

  /**
   * Get Comic AI Service
   */
  getComicService(): IAIComicService {
    if (!this.comicService) {
      throw new Error('AI services not initialized. Call initialize() first.');
    }
    return this.comicService;
  }

  /**
   * Get Video AI Service
   */
  getVideoService(): IAIVideoService {
    if (!this.videoService) {
      throw new Error('AI services not initialized. Call initialize() first.');
    }
    return this.videoService;
  }

  /**
   * Check if services are initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }
}

/**
 * Export singleton instance
 */
export const AIServiceFactory = AIServiceFactoryClass.getInstance();
