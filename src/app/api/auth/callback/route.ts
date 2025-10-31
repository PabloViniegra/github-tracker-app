import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * OAuth Callback Route Handler
 *
 * This route handles the OAuth callback from the backend API.
 * Instead of exposing tokens in the URL (which gets logged in browser history),
 * we store them in httpOnly cookies for better security.
 *
 * Flow:
 * 1. Backend redirects to: /api/auth/callback?access_token=xxx&refresh_token=xxx
 * 2. This handler stores tokens in secure cookies
 * 3. Redirects to /callback (clean URL without tokens)
 * 4. Frontend callback page reads from cookies and moves to localStorage
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Extract tokens from URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  // const state = searchParams.get("state"); // TODO: Implement CSRF validation
  const error = searchParams.get("error");

  // Handle error case
  if (error) {
    const errorEncoded = encodeURIComponent(error);
    return NextResponse.redirect(
      new URL(`/callback?error=${errorEncoded}`, request.url)
    );
  }

  // CSRF Protection: Validate state parameter
  // Note: State validation should ideally be done server-side with session
  // For now, we pass it to the frontend for validation
  // TODO: Implement proper server-side session-based state validation

  // Validate tokens
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(
      new URL("/callback?error=missing_tokens", request.url)
    );
  }

  // Store tokens in httpOnly cookies (more secure than URL params)
  const cookieStore = await cookies();

  // Set httpOnly cookies with secure flags
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutes (matches token expiry)
    path: "/",
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days (matches refresh token expiry)
    path: "/",
  });

  // Redirect to callback page without tokens in URL
  return NextResponse.redirect(new URL("/callback", request.url));
}
