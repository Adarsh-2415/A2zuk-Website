"use client";

import { useState, useRef, useEffect, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { TargetSizeOptimizer } from "@/lib/compressor/TargetSizeOptimizer";
import { FileValidator } from "@/lib/compressor/FileValidator";
import { FileAnalyzer } from "@/lib/compressor/FileAnalyzer";

interface PhotoDropzoneProps {
  onPhotoSelected: (file: File | null) => void;
  error?: string;
}

const MAX_TARGET_BYTES = 1048576; // Target size: <= 1 MB (1,048,576 bytes)
const MAX_RAW_INPUT_BYTES = 15 * 1024 * 1024; // Accept original smartphone files up to 15 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PhotoDropzone({ onPhotoSelected, error }: PhotoDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<string>("");
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    optimizedSize: string;
    wasCompressed: boolean;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optimizerRef = useRef<TargetSizeOptimizer>(new TargetSizeOptimizer());

  // Revoke object URL on cleanup
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = async (file: File) => {
    setValidationError(null);
    setCompressionStats(null);

    // Initial basic format validation
    const ext = FileValidator.extractExtension(file.name);
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase()) && !["jpg", "jpeg", "png", "webp"].includes(ext)) {
      setValidationError("Unsupported file format. Please upload a JPG, PNG, or WebP photo.");
      return;
    }

    // Input size ceiling (15 MB)
    if (file.size > MAX_RAW_INPUT_BYTES) {
      setValidationError("Photo exceeds 15 MB. Please select a photo under 15 MB.");
      return;
    }

    // Binary magic bytes validation
    const valResult = await FileValidator.validate(file);
    if (!valResult.isValid) {
      setValidationError(valResult.errorMessage || "Invalid or unreadable image file.");
      return;
    }

    // Passthrough: if already <= 1 MB, no compression needed
    if (file.size <= MAX_TARGET_BYTES) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreview = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(newPreview);
      setCompressionStats({
        originalSize: FileAnalyzer.formatBytes(file.size),
        optimizedSize: FileAnalyzer.formatBytes(file.size),
        wasCompressed: false,
      });
      onPhotoSelected(file);
      return;
    }

    // Automatic Target-Size Compression (under 1 MB)
    setIsCompressing(true);
    setCompressionProgress("Optimizing photo size...");

    try {
      const result = await optimizerRef.current.optimizeToTargetSize(
        file,
        {
          maxSizeBytes: MAX_TARGET_BYTES,
          targetMimeType: "image/webp",
          minQuality: 0.65,
          maxIterations: 5,
        },
        (description) => {
          setCompressionProgress(description);
        }
      );

      if (result.status === "FAILED" && result.optimizedSize > MAX_TARGET_BYTES) {
        setValidationError(
          `Unable to compress photo under 1 MB (best effort: ${FileAnalyzer.formatBytes(
            result.optimizedSize
          )}). Please pick a smaller photo.`
        );
        return;
      }

      const finalFile = result.optimizedFile;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreview = URL.createObjectURL(finalFile);

      setSelectedFile(finalFile);
      setPreviewUrl(newPreview);
      setCompressionStats({
        originalSize: FileAnalyzer.formatBytes(result.originalSize),
        optimizedSize: FileAnalyzer.formatBytes(result.optimizedSize),
        wasCompressed: true,
      });
      onPhotoSelected(finalFile);
    } catch {
      setValidationError("Failed to optimize photo. Please try a different photo.");
    } finally {
      setIsCompressing(false);
      setCompressionProgress("");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    setCompressionStats(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onPhotoSelected(null);
  };

  const activeError = validationError || error;

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs sm:text-sm font-semibold text-[#1B382B]">
        Upload a favourite photo
      </label>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="sr-only"
        id="photo-upload-input"
        aria-describedby={activeError ? "photo-error" : undefined}
      />

      {/* Upload Box / Loading Box / Preview Box */}
      {isCompressing ? (
        <div className="w-full rounded-2xl border-2 border-[#234E3D]/30 bg-[#FAF8F5] p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-3 border-[#234E3D] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-bold text-[#1B382B]">
            {compressionProgress || "Optimizing photo for contest..."}
          </p>
          <p className="text-xs text-[#5A6D61] mt-1">
            Automatically compressing to under 1 MB with high visual quality.
          </p>
        </div>
      ) : !previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload a photo. Click or drag and drop a file."
          className={`w-full rounded-2xl border-2 border-dashed p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234E3D] ${isDragOver
              ? "border-[#234E3D] bg-[#234E3D]/5 scale-[0.99]"
              : activeError
                ? "border-red-400 bg-red-50/40"
                : "border-[#EFECE4] bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] hover:border-[#D4E865]"
            }`}
        >
          {/* Lime Circle with Arrow Up */}
          <div className="w-11 h-11 rounded-full bg-[#D4E865] flex items-center justify-center text-[#1B382B] mb-3 shadow-xs">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>

          <p className="text-sm font-bold text-[#1B382B] mb-1">
            Drag a photo here or browse files
          </p>
          <p className="text-xs text-[#5A6D61]">
            JPG, PNG or WebP • <span className="font-semibold text-[#234E3D]">Automatically compressed</span> under 1 MB
          </p>
        </div>
      ) : (
        /* Image Preview Card with Compression Badge */
        <div className="w-full rounded-2xl border border-[#EFECE4] bg-[#FAF8F5] p-4 flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-black/5 shrink-0 shadow-xs border border-white">
            <Image
              src={previewUrl}
              alt="Uploaded baby photo preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-[#1B382B] truncate">
              {selectedFile?.name || "Selected photo"}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className="text-xs text-[#5A6D61]">
                {selectedFile ? FileAnalyzer.formatBytes(selectedFile.size) : ""}
              </span>
              {compressionStats?.wasCompressed && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#234E3D]/10 text-[#234E3D]">
                  Compressed from {compressionStats.originalSize}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[#234E3D] hover:underline focus-visible:outline-none"
              >
                Change photo
              </button>
              <span className="text-black/20" aria-hidden="true">•</span>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs font-semibold text-red-600 hover:underline focus-visible:outline-none"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {activeError && (
        <p id="photo-error" className="text-xs font-medium text-red-600 pt-1 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{activeError}</span>
        </p>
      )}
    </div>
  );
}
