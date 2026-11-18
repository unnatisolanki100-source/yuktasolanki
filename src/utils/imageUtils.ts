import { FIELD_LIMITS } from '../types';

export async function compressImageToDataUrl(
  file: File,
  maxWidth = 1080,
  quality = 0.82
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Could not read the selected image file.'));
      image.src = objectUrl;
    });

    const scale = img.width > maxWidth ? maxWidth / img.width : 1;
    const width = Math.max(1, Math.round(img.width * scale));
    const height = Math.max(1, Math.round(img.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas image processing is unavailable in this browser.');
    }
    ctx.drawImage(img, 0, 0, width, height);

    let result = canvas.toDataURL('image/jpeg', quality);
    if (result.length > FIELD_LIMITS.imageUrlMax - 10000) {
      result = canvas.toDataURL('image/jpeg', 0.65);
    }
    if (result.length > FIELD_LIMITS.imageUrlMax - 5000) {
      throw new Error('Image is too large after compression. Please choose a smaller photograph.');
    }
    return result;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
