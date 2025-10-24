/**
 * Gemini Video AI Service
 * Handles video generation from comic panels using Gemini VEO
 */

import { GoogleGenAI } from "@google/genai";
import { AIBaseProvider } from '../../core/AIBaseProvider';
import { base64ToImageData, getImageAspectRatio, downloadBlob } from '../../utils/AIImageUtils';
import type {
  IAIVideoService,
  AIVideoGenerationRequest,
  AIVideoGenerationResponse,
  AIVideoDownloadRequest,
} from '../../types';

export class AIGeminiVideoService extends AIBaseProvider implements IAIVideoService {
  private ai?: GoogleGenAI;

  constructor() {
    super('GeminiVideoService');
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
   * Generate video from comic panel
   */
  async generateVideo(request: AIVideoGenerationRequest): Promise<AIVideoGenerationResponse> {
    this.ensureInitialized();

    try {
      request.onProgress?.('Preparing video generation...');

      // Detect the aspect ratio of the input image
      const aspectRatio = await getImageAspectRatio(request.panelImage);
      request.onProgress?.(`Detected aspect ratio: ${aspectRatio}`);

      // Construct the dialogue script
      const dialogueScript = request.characters
        .filter(c => c.dialogue)
        .map(c => `${c.name}: "${c.dialogue}"`)
        .join('\n');

      const fullScript = `${request.narration}\n\n${dialogueScript}`;

      // Convert the panel image to a format Gemini can use
      const imageData = base64ToImageData(request.panelImage);

      // Create the prompt for video generation
      const prompt = `Animate this comic panel image into a dynamic video. The video should bring the scene to life with smooth animations, character movements, and atmospheric effects. Include the following dialogue and narration as audio voiceover:

${fullScript}

Maintain the artistic style and mood of the original comic panel while adding motion and depth to the scene. The video should be 5-10 seconds long.`;

      request.onProgress?.('Generating video with VEO...');

      // Call Gemini VEO model for video generation
      const ai = this.getAI();
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-generate-preview',
        source: {
          prompt: prompt,
          image: imageData,
        },
        config: {
          numberOfVideos: 1,
          durationSeconds: 8,
          resolution: '720p',
          enhancePrompt: true,
          aspectRatio: aspectRatio,
          generateAudio: true,
        },
      });

      request.onProgress?.('Processing video generation (this may take a few minutes)...');

      // Poll the operation until it's complete
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between checks
        operation = await ai.operations.getVideosOperation({ operation });
        request.onProgress?.('Still generating video...');
      }

      if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
        const generatedVideo = operation.response.generatedVideos[0].video;

        if (generatedVideo?.uri) {
          request.onProgress?.('Downloading video...');

          // Download the video and convert to blob URL for local viewing
          const response = await fetch(generatedVideo.uri);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          request.onProgress?.('Video generated successfully!');
          return { videoUrl: blobUrl };
        } else {
          throw new Error('No video URI received from AI');
        }
      } else {
        throw new Error('No video generated');
      }
    } catch (error) {
      console.error("Error generating video:", error);
      throw new Error(`Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Download video to disk
   */
  async downloadVideo(request: AIVideoDownloadRequest): Promise<void> {
    try {
      const response = await fetch(request.videoUrl);
      const blob = await response.blob();
      downloadBlob(blob, request.filename);
    } catch (error) {
      console.error('Error downloading video:', error);
      throw new Error('Failed to download video');
    }
  }
}
