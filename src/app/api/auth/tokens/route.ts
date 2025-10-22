import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Tokens API Route
 *
 * Allows frontend to retrieve tokens from httpOnly cookies
 * and store them in localStorage for API calls.
 *
 * This is called once during the callback flow, then tokens
 * are moved to localStorage for the rest of the session.
 *
 * GET /api/auth/tokens
 * Returns: { access_token, refresh_token } or { error }
 */
export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "No tokens found" },
      { status: 401 }
    );
  }

  // Return tokens and clear cookies (move to localStorage)
  const response = NextResponse.json({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Clear cookies after reading (tokens will be in localStorage)
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
