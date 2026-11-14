import { FileMetadata } from './types';
import { FileValidator } from './FileValidator';

export class FileAnalyzer {
  public static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Extracts image dimensions using createImageBitmap with HTMLImageElement fallback
   */
  public static async extractDimensions(file: File): Promise<{ width: number; height: number }> {
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(file);
        const dimensions = {
          width: bitmap.width,
          height: bitmap.height,
        };
        bitmap.close();
        return dimensions;
      } catch {
        // Fall back to Image element if bitmap decoding fails
      }
    }

    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const dimensions = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        URL.revokeObjectURL(objectUrl);
        resolve(dimensions);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Corrupted image or unreadable raster content.'));
      };

      img.src = objectUrl;
    });
  }

  /**
   * Analyzes selected file and returns detailed metadata metrics
   */
  public static async analyze(file: File): Promise<FileMetadata> {
    const extension = FileValidator.extractExtension(file.name);
    const formattedSize = this.formatBytes(file.size);

    let width: number | undefined;
    let height: number | undefined;

    try {
      const dims = await this.extractDimensions(file);
      width = dims.width;
      height = dims.height;
    } catch {
      // Dimensions optional for non-blocking analysis
    }

    return {
      name: file.name,
      sizeBytes: file.size,
      formattedSize,
      mimeType: file.type || `image/${extension}`,
      extension,
      width,
      height,
    };
  }
}

