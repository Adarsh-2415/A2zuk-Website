import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Retrieve destination from query param or fallback to cookie set prior to OAuth
  const cookieStore = await cookies();
  const cookieNext = cookieStore.get("auth_redirect_next")?.value;
  const rawNext = searchParams.get("next") || cookieNext || "/";

  // Security: only allow relative paths to prevent open-redirect vulnerabilities
  const safeRedirectPath = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(new URL(safeRedirectPath, origin));
      // Clear one-time redirect cookie
      response.cookies.delete("auth_redirect_next");
      return response;
    }
    console.error("[auth/callback] exchangeCodeForSession error:", error.message);
  }

  // Return user to target path or home on failure
  const errorResponse = NextResponse.redirect(
    new URL(`${safeRedirectPath}?auth_error=true`, origin),
  );
  errorResponse.cookies.delete("auth_redirect_next");
  return errorResponse;
}

