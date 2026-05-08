import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json({ error: "Cupón no encontrado" }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "Este cupón ya no está activo" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Este cupón ha agotado sus usos" }, { status: 400 });
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return NextResponse.json({ error: "Este cupón ha expirado" }, { status: 400 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: "Error al validar cupón" }, { status: 500 });
  }
}
