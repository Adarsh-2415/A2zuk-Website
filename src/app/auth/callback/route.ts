import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default fallback if next parameter is missing or malicious
  const next = searchParams.get("next") ?? "/";

  // Security: only allow relative paths to prevent open-redirect vulnerabilities
  const safeRedirectPath = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeRedirectPath}`);
    }
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // Return user to target path or home on failure
  return NextResponse.redirect(`${origin}${safeRedirectPath}?auth_error=true`);
}

