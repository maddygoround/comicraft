import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { ComicPanel, Character, ComicStyle, PanelCharacter } from "../types";
import { MAX_PANELS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY as string });

// Helper to convert a File object to a GoogleGenAI.Part object
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};


export const extractCharacters = async (storyText: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract the character names from the following story. Ignore descriptive names and focus on proper nouns that are likely characters. Story: "${storyText}"`,
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
    return result.characters || [];
  } catch (error) {
    console.error("Error extracting characters:", error);
    // Fallback for failed extraction
    const manualExtract = storyText.match(/[A-Z][a-z]+/g) || [];
    const uniqueNames = [...new Set(manualExtract)];
    return uniqueNames.slice(0, 5); // Limit fallback results
  }
};

export const generateAnimeCharacter = async (characterName: string, description?: string): Promise<string> => {
  try {
    const prompt = description
      ? `Generate an anime-style character image for "${characterName}". Description: ${description}. The character should be in anime/manga style with vibrant colors, expressive features, and detailed design. Create a full-body character illustration with dynamic pose and expressive features.`
      : `Generate an anime-style character image for "${characterName}". The character should be in anime/manga style with vibrant colors, expressive features, and detailed design. Create a full-body character illustration with dynamic pose and expressive features.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    } else {
      throw new Error('No image data received from AI');
    }
  } catch (error) {
    console.error("Error generating anime character:", error);
    throw new Error("Failed to generate anime character");
  }
};

type TextualPanel = Omit<ComicPanel, 'generatedImage'>;

export const generateComicPanels = async (
  storyText: string,
  characters: Character[],
  style: ComicStyle,
  onProgress?: (current: number, total: number) => void
): Promise<ComicPanel[]> => {
  const characterNames = characters.map(c => c.name).join(", ");

  // Step 1: Generate the textual breakdown of panels
  let textualPanels: TextualPanel[] = [];
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `You are a comic book writer. Your task is to break down the following story into a sequence of comic book panels. The story involves these characters: ${characterNames}. The desired style is ${style.style}.
      
      Rules:
      1. Create a maximum of ${MAX_PANELS} panels.
      2. For each panel, provide a panel number.
      3. Provide a brief narration for the scene.
      4. List the characters present in the panel.
      5. Provide the dialogue for each character in the panel. If a character has no dialogue, use an empty string.
      
      Story: "${storyText}"`,
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
    return [];
  }

  if (textualPanels.length === 0) return [];

  // Step 2: Generate an image for each panel sequentially to avoid rate limits
  const finalPanels: ComicPanel[] = [];
  let panelIndex = 0;
  for (const panel of textualPanels) {
    const charactersInPanel = characters.filter(char =>
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

    const prompt = `Generate a single comic book panel in a "${style.style}" style with a "${style.palette}" color palette. 
    The scene is: "${panel.narration}".
    Characters present: ${panel.characters.map(c => c.name).join(', ')}.
    ${dialogueSummary}.
    Crucially, show the characters interacting with dynamic and expressive body language that reflects the conversation. Do not just show static portraits. 
    Use the provided reference images to inform the characters' appearance and clothing, but create a completely new, original illustration that fits the scene.`;

    let generatedImage = 'https://via.placeholder.com/300x400.png?text=Generation+Failed';
    try {
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

    onProgress?.(panelIndex + 1, textualPanels.length);
    panelIndex++;

    // Add a delay between requests to avoid hitting rate limits
    if (panelIndex < textualPanels.length) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  return finalPanels;
};
