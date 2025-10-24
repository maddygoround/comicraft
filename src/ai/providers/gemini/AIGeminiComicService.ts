/**
 * Gemini Comic AI Service
 * Handles comic panel generation using Gemini AI
 */

import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AIBaseProvider } from '../../core/AIBaseProvider';
import { fileToGenerativePart } from '../../utils/AIImageUtils';
import { MAX_PANELS } from '../../../constants';
import type { ComicPanel } from '../../../types';
import type {
  IAIComicService,
  AIComicPanelRequest,
  AIComicPanelResponse,
} from '../../types';

type TextualPanel = Omit<ComicPanel, 'generatedImage'>;

export class AIGeminiComicService extends AIBaseProvider implements IAIComicService {
  private ai?: GoogleGenAI;

  constructor() {
    super('GeminiComicService');
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
   * Generate comic panels from story
   */
  async generateComicPanels(request: AIComicPanelRequest): Promise<AIComicPanelResponse> {
    this.ensureInitialized();

    const characterNames = request.characters.map(c => c.name).join(", ");

    // Step 1: Generate the textual breakdown of panels
    let textualPanels: TextualPanel[] = [];
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: `You are a comic book writer. Your task is to break down the following story into a sequence of comic book panels. The story involves these characters: ${characterNames}. The desired style is ${request.style.style}.

      Rules:
      1. Create a maximum of ${MAX_PANELS} panels.
      2. For each panel, provide a panel number.
      3. Provide a brief narration for the scene.
      4. List the characters present in the panel.
      5. Provide the dialogue for each character in the panel. If a character has no dialogue, use an empty string.

      Story: "${request.storyText}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              panels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    panelNumber: { type: Type.INTEGER },
                    narration: { type: Type.STRING },
                    characters: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          dialogue: { type: Type.STRING },
                        },
                        required: ["name", "dialogue"],
                      },
                    },
                  },
                  required: ["panelNumber", "narration", "characters"],
                },
              },
            },
            required: ["panels"],
          },
        },
      });

      const jsonText = response.text?.trim();
      if (!jsonText) {
        throw new Error('No response from AI');
      }
      const result = JSON.parse(jsonText);
      textualPanels = result.panels || [];
    } catch (error) {
      console.error("Error generating comic panel text:", error);
      return { panels: [] };
    }

    if (textualPanels.length === 0) {
      return { panels: [] };
    }

    // Step 2: Generate an image for each panel sequentially to avoid rate limits
    const finalPanels: ComicPanel[] = [];
    let panelIndex = 0;

    for (const panel of textualPanels) {
      const charactersInPanel = request.characters.filter(char =>
        panel.characters.some(pc => pc.name.toLowerCase() === char.name.toLowerCase())
      );

      const imageParts = await Promise.all(
        charactersInPanel
          .filter(c => c.photos.length > 0 && c.photos[0].file)
          .map(c => fileToGenerativePart(c.photos[0].file!))
      );

      const dialogueSummary = panel.characters
        .filter(c => c.dialogue)
        .map(c => `${c.name} says: "${c.dialogue}"`).join(' ');

      const prompt = `Generate a single comic book panel in a "${request.style.style}" style with a "${request.style.palette}" color palette.
    The scene is: "${panel.narration}".
    Characters present: ${panel.characters.map(c => c.name).join(', ')}.
    ${dialogueSummary}.
    Crucially, show the characters interacting with dynamic and expressive body language that reflects the conversation. Do not just show static portraits.
    Use the provided reference images to inform the characters' appearance and clothing, but create a completely new, original illustration that fits the scene.`;

      let generatedImage = 'https://via.placeholder.com/300x400.png?text=Generation+Failed';
      try {
        const ai = this.getAI();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }, ...imageParts] },
          config: {
            responseModalities: [Modality.IMAGE],
          },
        });

        const firstPart = response.candidates?.[0]?.content?.parts?.[0];
        if (firstPart && firstPart.inlineData) {
          generatedImage = `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
        }
      } catch (error) {
        console.error(`Error generating image for panel ${panel.panelNumber}:`, error);
      }

      finalPanels.push({ ...panel, generatedImage });

      request.onProgress?.(panelIndex + 1, textualPanels.length);
      panelIndex++;

      // Add a delay between requests to avoid hitting rate limits
      if (panelIndex < textualPanels.length) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    return { panels: finalPanels };
  }
}
