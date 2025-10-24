/**
 * AI Image Utility Functions
 * Helper functions for image processing in AI services
 */

/**
 * Convert base64 data URL to Image format with bytes and MIME type
 */
export const base64ToImageData = (base64DataUrl: string) => {
  const [mimeTypePart, base64Data] = base64DataUrl.split(',');
  const mimeType = mimeTypePart.match(/:(.*?);/)?.[1] || 'image/png';
  return {
    imageBytes: base64Data,
    mimeType,
  };
};

/**
 * Convert File object to base64 generative part
 */
export const fileToGenerativePart = async (file: File) => {
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

/**
 * Detect aspect ratio from base64 image
 * Returns '16:9' for landscape or '9:16' for portrait
 */
export const getImageAspectRatio = async (base64DataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;

      // Determine closest supported aspect ratio
      // VEO supports 16:9 (1.778) and 9:16 (0.5625)
      if (aspectRatio > 1) {
        // Landscape - use 16:9
        resolve('16:9');
      } else {
        // Portrait - use 9:16
        resolve('9:16');
      }
    };
    img.onerror = () => {
      // Default to 16:9 if there's an error
      resolve('16:9');
    };
    img.src = base64DataUrl;
  });
};

/**
 * Download blob as file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
