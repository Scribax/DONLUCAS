import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener cupones" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { code, discount, type, expiresAt, usageLimit } = await req.json();

    if (!code || isNaN(parseFloat(discount))) {
      return NextResponse.json({ error: "Código o descuento inválido" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discount: parseFloat(discount),
        type,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null
      }
    });

    return NextResponse.json(coupon);
  } catch (error: any) {
    console.error("[COUPON_POST]", error);
    // Error de código duplicado en Prisma
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Este código de cupón ya existe" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Error al crear cupón" }, { status: 500 });
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

    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ message: "Cupón eliminado" });
  } catch (error: any) {
    console.error("[COUPON_DELETE]", error);
    return NextResponse.json({ error: error.message || "Error al eliminar" }, { status: 500 });
  }
}
