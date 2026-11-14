export type SupportedImageMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp';

export type OptimizationStatus = 'SUCCESS' | 'PASSTHROUGH' | 'FAILED';

export interface ValidationResult {
  isValid: boolean;
  detectedMimeType?: SupportedImageMimeType;
  errorMessage?: string;
  code?: string;
}

export interface FileMetadata {
  name: string;
  sizeBytes: number;
  formattedSize: string;
  mimeType: string;
  extension: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

export interface OptimizationConfig {
  maxSizeBytes: number;
  minQuality?: number;
  targetMimeType?: SupportedImageMimeType;
  maxIterations?: number;
  minWidth?: number;
  minHeight?: number;
}

export interface OptimizationResult {
  status: OptimizationStatus;
  originalFile: File;
  optimizedFile: File;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  iterationsUsed: number;
  finalQuality: number;
  finalWidth: number;
  finalHeight: number;
  processingTimeMs: number;
  statusMessage?: string;
  errorMessage?: string;
}

