import { NextRequest, NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, customer, location, shippingCost, distance, totalAmount, pointsUsed, couponId } = body;

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      return NextResponse.json({ error: "Configuración de MercadoPago incompleta" }, { status: 500 });
    }

    // 1. Crear el pedido en la base de datos (como Pendiente de Pago)
    const order = await prisma.order.create({
      data: {
        customerName: customer.name,
        customerEmail: session?.user?.email ?? "invitado@donlucas.com",
        customerPhone: customer.phone,
        address: customer.address,
        latitude: location?.lat,
        longitude: location?.lng,
        totalAmount,
        shippingCost,
        distance,
        paymentMethod: "MERCADOPAGO",
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
      }
    });

    // 2. Crear la preferencia en MercadoPago
    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: 'ARS'
        })),
        // Agregar el costo de envío como un item extra si existe
        ...(shippingCost > 0 ? [{
          id: 'shipping',
          title: 'Costo de Envío',
          quantity: 1,
          unit_price: shippingCost,
          currency_id: 'ARS'
        }] : []),
        back_urls: {
          success: `${process.env.NEXTAUTH_URL}/pago-exitoso?orderId=${order.id}`,
          failure: `${process.env.NEXTAUTH_URL}/checkout?error=payment_failed`,
          pending: `${process.env.NEXTAUTH_URL}/checkout?error=payment_pending`,
        },
        auto_return: 'approved',
        external_reference: order.id,
      }
    });

    return NextResponse.json({ init_point: result.init_point });

  } catch (error: any) {
    console.error("Error creating payment preference:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
