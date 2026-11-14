import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
});

export type PublicSupabaseEnv = z.infer<typeof publicEnvSchema>;
export type ServerSupabaseEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validates and returns the public Supabase environment variables.
 * Uses explicit property access so Next.js can inline NEXT_PUBLIC_* values.
 */
export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

/**
 * Validates and returns the server-only Supabase environment variables.
 * Throws immediately if called in a browser runtime.
 */
export function getServerSupabaseEnv(): ServerSupabaseEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "getServerSupabaseEnv() must never be called in a browser environment.",
    );
  }

  return serverEnvSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

