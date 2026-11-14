import { OptimizationConfig, OptimizationResult } from './types';
import { FileValidator } from './FileValidator';
import { FileAnalyzer } from './FileAnalyzer';
import { ImageOptimizationEngine, CandidateResult } from './ImageOptimizationEngine';

export class TargetSizeOptimizer {
  private engine: ImageOptimizationEngine;

  constructor() {
    this.engine = new ImageOptimizationEngine();
  }

  private scoreCandidate(
    candidate: CandidateResult,
    origWidth: number,
    origHeight: number,
    targetSizeBytes: number
  ): number {
    const origArea = origWidth * origHeight;
    const candArea = candidate.width * candidate.height;
    const resolutionRatio = origArea > 0 ? candArea / origArea : 1.0;
    const qualityWeight = candidate.quality;

    const sizeProximity =
      candidate.size <= targetSizeBytes
        ? candidate.size / targetSizeBytes
        : 0;

    return qualityWeight * 0.4 + resolutionRatio * 0.4 + sizeProximity * 0.2;
  }

  /**
   * Main Smart Target-Size Optimization Algorithm
   */
  public async optimizeToTargetSize(
    file: File,
    config: OptimizationConfig,
    onProgress?: (stepDescription: string, percent: number) => void
  ): Promise<OptimizationResult> {
    const startTime = performance.now();

    // 1. Validate Input File
    onProgress?.('Validating file format...', 10);
    const valResult = await FileValidator.validate(file);
    if (!valResult.isValid) {
      return {
        status: 'FAILED',
        originalFile: file,
        optimizedFile: file,
        originalSize: file.size,
        optimizedSize: file.size,
        compressionRatio: 1.0,
        iterationsUsed: 0,
        finalQuality: 1.0,
        finalWidth: 0,
        finalHeight: 0,
        processingTimeMs: 0,
        errorMessage: valResult.errorMessage || 'Invalid image file.',
      };
    }

    // 2. Passthrough Check: If already under target size
    if (file.size <= config.maxSizeBytes) {
      onProgress?.('File is already within target size limit.', 100);
      return {
        status: 'PASSTHROUGH',
        originalFile: file,
        optimizedFile: file,
        originalSize: file.size,
        optimizedSize: file.size,
        compressionRatio: 1.0,
        iterationsUsed: 0,
        finalQuality: 1.0,
        finalWidth: 0,
        finalHeight: 0,
        processingTimeMs: Math.round(performance.now() - startTime),
        statusMessage: 'Original file is already within target size.',
      };
    }

    // 3. Extract baseline dimensions
    onProgress?.('Analyzing dimensions...', 20);
    const metadata = await FileAnalyzer.analyze(file);
    const origWidth = metadata.width || 1920;
    const origHeight = metadata.height || 1080;
    const aspectRatio = origWidth / origHeight;

    let iterationsUsed = 0;
    const maxIterations = Math.max(1, config.maxIterations || 5);
    const minQualityFloor = Math.max(0.3, config.minQuality || 0.6);
    const minWidthFloor = Math.max(100, config.minWidth || 640);
    const minHeightFloor = Math.max(100, config.minHeight || 480);
    const targetMimeType = config.targetMimeType || 'image/webp';

    const validCandidates: CandidateResult[] = [];
    let bestUnderLimit: CandidateResult | null = null;
    let smallestOverall: CandidateResult | null = null;

    let currentWidth = Math.min(origWidth, 2048);
    let currentHeight = Math.round(currentWidth / aspectRatio);

    // Initial Quality Probe
    let lowQ = minQualityFloor;
    let highQ = 0.92;
    let targetQ = 0.82;

    while (iterationsUsed < maxIterations) {
      iterationsUsed += 1;
      const progressPercent = Math.round(20 + (iterationsUsed / maxIterations) * 75);
      onProgress?.(`Optimizing photo (${iterationsUsed}/${maxIterations})...`, progressPercent);

      try {
        const candidate = await this.engine.compress(
          file,
          targetMimeType,
          targetQ,
          currentWidth,
          currentHeight
        );

        if (!smallestOverall || candidate.size < smallestOverall.size) {
          smallestOverall = candidate;
        }

        if (candidate.size <= config.maxSizeBytes) {
          validCandidates.push(candidate);

          if (!bestUnderLimit) {
            bestUnderLimit = candidate;
          } else {
            const currentScore = this.scoreCandidate(
              candidate,
              origWidth,
              origHeight,
              config.maxSizeBytes
            );
            const bestScore = this.scoreCandidate(
              bestUnderLimit,
              origWidth,
              origHeight,
              config.maxSizeBytes
            );
            if (currentScore > bestScore) {
              bestUnderLimit = candidate;
            }
          }

          // If close enough to target size (>= 75% of limit), finish early
          if (candidate.size >= config.maxSizeBytes * 0.75) {
            break;
          }

          // File fits, try slightly higher quality
          lowQ = targetQ;
          targetQ = Number(((lowQ + highQ) / 2).toFixed(2));
        } else {
          // File is too large, lower quality
          highQ = targetQ;
          targetQ = Number(((lowQ + highQ) / 2).toFixed(2));

          // If quality hits floor and still too large, downscale dimensions
          if (highQ - lowQ < 0.08 || targetQ <= minQualityFloor + 0.05) {
            const downscaledWidth = Math.round(currentWidth * 0.8);
            const downscaledHeight = Math.round(downscaledWidth / aspectRatio);

            if (downscaledWidth >= minWidthFloor && downscaledHeight >= minHeightFloor) {
              currentWidth = downscaledWidth;
              currentHeight = downscaledHeight;
              lowQ = minQualityFloor;
              highQ = 0.85;
              targetQ = 0.75;
            }
          }
        }
      } catch (err) {
        console.error('[TargetSizeOptimizer] Iteration failed:', err);
        break;
      }
    }

    onProgress?.('Finalizing optimized photo...', 100);

    const winningCandidate = bestUnderLimit || smallestOverall;

    if (!winningCandidate) {
      return {
        status: 'FAILED',
        originalFile: file,
        optimizedFile: file,
        originalSize: file.size,
        optimizedSize: file.size,
        compressionRatio: 1.0,
        iterationsUsed,
        finalQuality: 1.0,
        finalWidth: origWidth,
        finalHeight: origHeight,
        processingTimeMs: Math.round(performance.now() - startTime),
        errorMessage: 'Unable to optimize image to target size.',
      };
    }

    const compressionRatio = Number((winningCandidate.size / file.size).toFixed(3));

    return {
      status: winningCandidate.size <= config.maxSizeBytes ? 'SUCCESS' : 'FAILED',
      originalFile: file,
      optimizedFile: winningCandidate.file,
      originalSize: file.size,
      optimizedSize: winningCandidate.size,
      compressionRatio,
      iterationsUsed,
      finalQuality: winningCandidate.quality,
      finalWidth: winningCandidate.width,
      finalHeight: winningCandidate.height,
      processingTimeMs: Math.round(performance.now() - startTime),
      statusMessage:
        winningCandidate.size <= config.maxSizeBytes
          ? `Successfully optimized from ${FileAnalyzer.formatBytes(file.size)} to ${FileAnalyzer.formatBytes(winningCandidate.size)}.`
          : `Best effort optimization reached ${FileAnalyzer.formatBytes(winningCandidate.size)}.`,
    };
  }
}

