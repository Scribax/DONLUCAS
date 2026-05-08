import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, customer, location, shippingCost, distance, totalAmount, paymentMethod, pointsUsed, couponId } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No hay productos en el pedido" }, { status: 400 });
    }

    const orderData: any = {
      customerName: customer.name,
      customerEmail: session?.user?.email ?? "invitado@donlucas.com",
      customerPhone: customer.phone,
      address: customer.address,
      latitude: location?.lat,
      longitude: location?.lng,
      totalAmount,
      shippingCost,
      distance,
      paymentMethod,
      status: "PENDING",
      userId: (session?.user as any)?.id || null,
      pointsUsed: pointsUsed || 0,
      couponId: couponId || null,
      items: {
        create: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
      }
    };

    const order = await prisma.order.create({
      data: orderData
    });

    // Si usó cupón, incrementamos el contador de usos
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    // Si usó puntos, se los descontamos de su cuenta
    if (pointsUsed && session?.user && (session.user as any).id) {
      await prisma.user.update({
        where: { id: (session.user as any).id },
        data: {
          points: { decrement: pointsUsed }
        }
      });
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
