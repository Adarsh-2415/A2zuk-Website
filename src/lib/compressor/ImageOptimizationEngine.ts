import { FileValidator } from './FileValidator';

export interface CandidateResult {
  blob: Blob;
  file: File;
  size: number;
  width: number;
  height: number;
  quality: number;
  processingTimeMs: number;
}

export class ImageOptimizationEngine {
  public canHandle(file: File): boolean {
    const ext = FileValidator.extractExtension(file.name);
    return ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
  }

  /**
   * Compresses image using HTMLCanvasElement / OffscreenCanvas
   */
  private async compressCanvas(
    file: File,
    targetMimeType: string,
    quality: number,
    targetWidth?: number,
    targetHeight?: number
  ): Promise<{ blob: Blob; width: number; height: number }> {
    let width = targetWidth && targetWidth > 0 ? Math.round(targetWidth) : 0;
    let height = targetHeight && targetHeight > 0 ? Math.round(targetHeight) : 0;

    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file);
      if (!width) width = bitmap.width;
      if (!height) height = bitmap.height;

      // Prefer OffscreenCanvas if available for speed
      if (typeof OffscreenCanvas !== 'undefined') {
        const offscreen = new OffscreenCanvas(width, height);
        const ctx = offscreen.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(bitmap, 0, 0, width, height);
          bitmap.close();

          const blob = await offscreen.convertToBlob({
            type: targetMimeType,
            quality,
          });

          return { blob, width, height };
        }
      }

      // Fallback to standard canvas element
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        bitmap.close();
        throw new Error('Failed to create 2D canvas context.');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), targetMimeType, quality);
      });

      canvas.width = 0;
      canvas.height = 0;

      if (!blob) {
        throw new Error('canvas.toBlob() returned null.');
      }

      return { blob, width, height };
    }

    // HTMLImageElement fallback for older browsers
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        if (!width) width = img.naturalWidth;
        if (!height) height = img.naturalHeight;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to create 2D canvas context.'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);

        canvas.toBlob(
          (blob) => {
            canvas.width = 0;
            canvas.height = 0;
            if (!blob) {
              reject(new Error('canvas.toBlob() returned null.'));
              return;
            }
            resolve({ blob, width, height });
          },
          targetMimeType,
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image for canvas compression.'));
      };

      img.src = objectUrl;
    });
  }

  public async compress(
    file: File,
    targetMimeType: string,
    quality: number,
    targetWidth?: number,
    targetHeight?: number
  ): Promise<CandidateResult> {
    const start = performance.now();
    const { blob, width, height } = await this.compressCanvas(
      file,
      targetMimeType,
      quality,
      targetWidth,
      targetHeight
    );

    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const ext = targetMimeType === 'image/webp' ? 'webp' : 'jpg';
    const optimizedFile = new File([blob], `${baseName}.${ext}`, {
      type: targetMimeType,
      lastModified: Date.now(),
    });

    return {
      blob,
      file: optimizedFile,
      size: blob.size,
      width,
      height,
      quality,
      processingTimeMs: Math.round(performance.now() - start),
    };
  }
}

