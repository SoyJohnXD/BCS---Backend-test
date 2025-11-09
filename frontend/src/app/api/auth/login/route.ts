import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { serverApi } from "@/lib/api-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await serverApi("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!apiRes.ok) {
      const errorData = await apiRes.json();
      return NextResponse.json(
        { message: errorData.message || "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const { token } = await apiRes.json();

    if (!token) {
      return NextResponse.json(
        { message: "No se recibió token del servidor" },
        { status: 500 }
      );
    }

    const cookie = serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 5,
      path: "/",
      sameSite: "strict",
    });

    const response = NextResponse.json(
      { user: { email: body.email } },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    console.error("Error en API Route de login:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
