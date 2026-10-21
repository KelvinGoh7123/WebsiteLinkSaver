/** Largest original file the form will accept before resizing. */
export const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;

/**
 * Stored data URLs longer than this are rewritten in the background.
 * About 100k characters is ~75 KB, enough for a card thumbnail.
 */
export const OVERSIZED_DATA_URL_LENGTH = 100_000;

const MAX_WIDTH = 800;
const MAX_HEIGHT = 450;
const TARGET_DATA_URL_LENGTH = 90_000;

export const imageService = {
  async uploadImage(file: File): Promise<string> {
    const objectUrl = URL.createObjectURL(file);
    try {
      const image = await loadImage(objectUrl);
      return compressImage(image, "");
    } catch (error) {
      console.error("Error processing image:", error);
      throw error;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  },

  async compressDataUrl(dataUrl: string): Promise<string> {
    const image = await loadImage(dataUrl);
    return compressImage(image, dataUrl);
  },

  isOversizedDataUrl(value: string | undefined): boolean {
    return (
      !!value &&
      value.startsWith("data:image") &&
      value.length > OVERSIZED_DATA_URL_LENGTH
    );
  },
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read image"));
    image.src = src;
  });
}

function compressImage(image: HTMLImageElement, original: string): string {
  if (!image.width || !image.height) {
    throw new Error("Could not read image");
  }

  const scale = Math.min(
    1,
    MAX_WIDTH / image.width,
    MAX_HEIGHT / image.height
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not read image");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.72;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrl.length > TARGET_DATA_URL_LENGTH && quality > 0.4) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }

  if (original.startsWith("data:") && dataUrl.length >= original.length) {
    return original;
  }

  return dataUrl;
}
