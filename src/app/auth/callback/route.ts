import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const RECOVERY_NEXT_COOKIE = "walpulse_recovery_next";

function safeNextPath(raw: string | undefined | null): string {
  if (!raw) return "/es/nueva-contrasena";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/es/nueva-contrasena";
  if (!raw.includes("/nueva-contrasena")) return "/es/nueva-contrasena";
  return raw;
}

/**
 * Exchanges the Auth `?code=` (PKCE) for a session cookie, then redirects to
 * the recovery "next" path (cookie or default /es/nueva-contrasena).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(
    searchParams.get("next") ?? request.cookies.get(RECOVERY_NEXT_COOKIE)?.value,
  );

  const fail = () => {
    const res = NextResponse.redirect(
      `${origin}${next}?error=recovery_session_invalid`,
    );
    res.cookies.set(RECOVERY_NEXT_COOKIE, "", { maxAge: 0, path: "/" });
    return res;
  };

  const authError = searchParams.get("error") ?? searchParams.get("error_code");
  if (authError || !code) {
    return fail();
  }

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return fail();
  }

  let response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.redirect(`${origin}${next}`);
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        // Clear one-shot recovery next cookie
        response.cookies.set(RECOVERY_NEXT_COOKIE, "", {
          maxAge: 0,
          path: "/",
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return fail();
  }

  response.cookies.set(RECOVERY_NEXT_COOKIE, "", { maxAge: 0, path: "/" });
  return response;
}
