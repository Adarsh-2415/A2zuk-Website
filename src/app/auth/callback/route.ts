import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Retrieve destination from query param or fallback to cookie set prior to OAuth
  const cookieHeader = request.headers.get("cookie") || "";
  const cookieMatch = cookieHeader.match(/auth_redirect_next=([^;]+)/);
  const cookieNext = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
  const rawNext = searchParams.get("next") || cookieNext || "/";

  // Security: only allow relative paths to prevent open-redirect vulnerabilities
  const safeRedirectPath = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${origin}${safeRedirectPath}`);
      // Clear one-time redirect cookie
      response.cookies.delete("auth_redirect_next");
      return response;
    }
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // Return user to target path or home on failure
  const errorResponse = NextResponse.redirect(`${origin}${safeRedirectPath}?auth_error=true`);
  errorResponse.cookies.delete("auth_redirect_next");
  return errorResponse;
}

