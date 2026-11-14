import "server-only";
import sharp, { type Metadata } from "sharp";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB (matches bucket limit)
const MIN_DIMENSION_PX = 100;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

export class PhotoProcessingError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 400) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export interface SanitizedPhotoResult {
  buffer: Buffer;
  contentType: "image/webp";
  extension: "webp";
  width: number;
  height: number;
}

/**
 * Validates raw image bytes, strips all EXIF/GPS/XMP metadata,
 * auto-orients, resizes large photos, and outputs a clean WebP buffer.
 */
export async function sanitizeSubmissionPhoto(
  inputBuffer: Buffer,
): Promise<SanitizedPhotoResult> {
  if (inputBuffer.byteLength === 0) {
    throw new PhotoProcessingError(
      "Uploaded photo file is empty.",
      "EMPTY_FILE",
      400,
    );
  }

  if (inputBuffer.byteLength > MAX_UPLOAD_BYTES) {
    throw new PhotoProcessingError(
      "Photo file exceeds the 5 MB maximum upload size.",
      "FILE_TOO_LARGE",
      400,
    );
  }

  let metadata: Metadata;
  try {
    metadata = await sharp(inputBuffer, {
      limitInputPixels: 40_000_000,
    }).metadata();
  } catch {
    throw new PhotoProcessingError(
      "Unable to read image file. Please upload a valid JPG, PNG, or WebP photo.",
      "INVALID_IMAGE",
      400,
    );
  }

  if (!metadata.format || !ALLOWED_FORMATS.has(metadata.format)) {
    throw new PhotoProcessingError(
      "Unsupported image format. Please upload a JPG, PNG, or WebP photo.",
      "INVALID_FORMAT",
      400,
    );
  }

  if (
    !metadata.width ||
    !metadata.height ||
    metadata.width < MIN_DIMENSION_PX ||
    metadata.height < MIN_DIMENSION_PX
  ) {
    throw new PhotoProcessingError(
      "Photo resolution is too small. Please choose a clearer photo.",
      "IMAGE_TOO_SMALL",
      400,
    );
  }

  // Re-encoding without .withMetadata() strips all EXIF, GPS, and camera tags.
  const { data, info } = await sharp(inputBuffer, {
    limitInputPixels: 40_000_000,
  })
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    contentType: "image/webp",
    extension: "webp",
    width: info.width,
    height: info.height,
  };
}

