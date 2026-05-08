import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany();
    const parsedZones = zones.map(z => ({
      ...z,
      coordinates: z.coordinates ? JSON.parse(z.coordinates) : []
    }));
    return NextResponse.json({ zones: parsedZones });
  } catch (error) {
    return NextResponse.json({ zones: [], error: "Error al obtener zonas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name, price, coordinates, color } = await req.json();

    const zone = await prisma.shippingZone.create({
      data: { 
        name, 
        price: parseFloat(price.toString()), 
        coordinates: JSON.stringify(coordinates), 
        color: color || "#166534" 
      }
    });

    return NextResponse.json(zone);
  } catch (error: any) {
    console.error("❌ Error al crear zona:", error);
    return NextResponse.json({ error: error.message || "Error al crear zona" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await prisma.shippingZone.delete({ where: { id } });
    return NextResponse.json({ message: "Zona eliminada" });
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
