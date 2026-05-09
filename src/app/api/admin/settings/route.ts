import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    let settings = await prisma.settings.findUnique({
      where: { id: "global" }
    });

    // Si no existen las configuraciones, las creamos por defecto
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: "global",
          cashbackPercent: 0.05,
          pointValueInPeso: 1.0,
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { cashbackPercent, pointValueInPeso } = body;

    const settings = await prisma.settings.upsert({
      where: { id: "global" },
      update: {
        cashbackPercent: cashbackPercent !== undefined ? parseFloat(cashbackPercent) : undefined,
        pointValueInPeso: pointValueInPeso !== undefined ? parseFloat(pointValueInPeso) : undefined,
      },
      create: {
        id: "global",
        cashbackPercent: cashbackPercent !== undefined ? parseFloat(cashbackPercent) : 0.05,
        pointValueInPeso: pointValueInPeso !== undefined ? parseFloat(pointValueInPeso) : 1.0,
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
