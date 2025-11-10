import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { serverApi } from "@/lib/api-client";

export async function POST(request: NextRequest) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await serverApi("/onboarding", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(responseData, {
        status: response.status,
      });
    }

    return NextResponse.json(responseData, {
      status: response.status,
    });
  } catch (error) {
    console.error("Error de red o parseo en BFF /api/onboarding:", error);
    return NextResponse.json(
      { message: "Error interno del servidor BFF" },
      { status: 500 }
    );
  }
}
