import { SupportedImageMimeType, ValidationResult } from './types';

export const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export class FileValidator {
  /**
   * Reads header magic bytes to accurately verify binary image format
   */
  private static inspectMagicBytes(bytes: Uint8Array): SupportedImageMimeType | null {
    if (bytes.length < 3) return null;

    // JPEG signature: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return 'image/jpeg';
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes.length >= 8 &&
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return 'image/png';
    }

    // WebP signature: "RIFF" at 0..3 and "WEBP" at 8..11
    if (
      bytes.length >= 12 &&
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return 'image/webp';
    }

    return null;
  }

  /**
   * Extract extension from filename
   */
  public static extractExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Validate image file structure and format
   */
  public static async validate(file: File): Promise<ValidationResult> {
    if (!file) {
      return {
        isValid: false,
        errorMessage: 'No file provided.',
        code: 'EMPTY_FILE',
      };
    }

    if (file.size === 0) {
      return {
        isValid: false,
        errorMessage: 'The selected file is empty (0 bytes).',
        code: 'EMPTY_FILE',
      };
    }

    const ext = this.extractExtension(file.name);
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      return {
        isValid: false,
        errorMessage: 'Unsupported file format. Please upload a JPG, PNG, or WebP photo.',
        code: 'UNSUPPORTED_FORMAT',
      };
    }

    // Magic bytes verification
    try {
      const slice = file.slice(0, 32);
      const buffer = await slice.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const detected = this.inspectMagicBytes(bytes);

      if (!detected) {
        return {
          isValid: false,
          errorMessage: 'Corrupted image file or unrecognized binary header.',
          code: 'MAGIC_BYTES_MISMATCH',
        };
      }

      return {
        isValid: true,
        detectedMimeType: detected,
      };
    } catch {
      return {
        isValid: false,
        errorMessage: 'Failed to read file headers. The file may be unreadable.',
        code: 'READ_ERROR',
      };
    }
  }
}

