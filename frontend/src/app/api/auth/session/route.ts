import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Verifica estado de autenticación basado en la cookie HttpOnly 'authToken'.
 * No devuelve el token, solo confirma su presencia. En un escenario real
 * se podría hacer una verificación contra el API Gateway (ej: /auth/me) para
 * validar que no esté expirado.
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { authenticated: true, user: { email: "unknown" } },
    { status: 200 }
  );
}
