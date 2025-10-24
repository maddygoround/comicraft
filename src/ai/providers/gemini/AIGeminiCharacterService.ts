/**
 * Gemini Character AI Service
 * Handles character extraction and image generation using Gemini AI
 */

import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AIBaseProvider } from '../../core/AIBaseProvider';
import type {
  IAICharacterService,
  AICharacterExtractionRequest,
  AICharacterExtractionResponse,
  AICharacterImageRequest,
  AICharacterImageResponse,
} from '../../types';

export class AIGeminiCharacterService extends AIBaseProvider implements IAICharacterService {
  private ai?: GoogleGenAI;

  constructor() {
    super('GeminiCharacterService');
  }

  protected async onInitialize(): Promise<void> {
    const config = this.getConfig();
    this.ai = new GoogleGenAI({ apiKey: config.apiKey as string });
  }

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      throw new Error('Gemini AI client is not initialized');
    }
    return this.ai;
  }

  /**
   * Extract characters from story text
   */
  async extractCharacters(request: AICharacterExtractionRequest): Promise<AICharacterExtractionResponse> {
    this.ensureInitialized();

    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Extract the character names from the following story. Ignore descriptive names and focus on proper nouns that are likely characters. Story: "${request.storyText}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              characters: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                  description: "A character name.",
                },
              },
            },
            required: ["characters"],
          },
        },
      });

      const jsonText = response.text?.trim();
      if (!jsonText) {
        throw new Error('No response from AI');
      }

      const result = JSON.parse(jsonText);
      return {
        characters: result.characters || [],
      };
    } catch (error) {
      console.error("Error extracting characters:", error);

      // Fallback for failed extraction
      const manualExtract = request.storyText.match(/[A-Z][a-z]+/g) || [];
      const uniqueNames = [...new Set(manualExtract)];
      return {
        characters: uniqueNames.slice(0, 5), // Limit fallback results
      };
    }
  }

  /**
   * Generate character image
   */
  async generateCharacterImage(request: AICharacterImageRequest): Promise<AICharacterImageResponse> {
    this.ensureInitialized();

    try {
      const ai = this.getAI();
      const prompt = request.description
        ? `Generate an anime-style character image for "${request.characterName}". Description: ${request.description}. The character should be in anime/manga style with vibrant colors, expressive features, and detailed design. Create a full-body character illustration with dynamic pose and expressive features.`
        : `Generate an anime-style character image for "${request.characterName}". The character should be in anime/manga style with vibrant colors, expressive features, and detailed design. Create a full-body character illustration with dynamic pose and expressive features.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const firstPart = response.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
        return {
          imageUrl: `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`,
        };
      } else {
        throw new Error('No image data received from AI');
      }
    } catch (error) {
      console.error("Error generating anime character:", error);
      throw new Error("Failed to generate anime character");
    }
  }
}
