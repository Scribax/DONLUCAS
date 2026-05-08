import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { MercadoPagoConfig, Preference } from 'mercadopago';

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

    // PASO 1: Descontar stock de los productos comprados
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }

    // PASO 2: Otorgar 5% del valor de la compra en puntos (Cashback)
    if (session?.user && (session.user as any).id) {
      const pointsEarned = Math.floor(totalAmount * 0.05);
      await prisma.user.update({
        where: { id: (session.user as any).id },
        data: {
          points: { increment: pointsEarned }
        }
      });
    }

    if (paymentMethod === "MERCADOPAGO") {
      try {
        const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' });
        const preference = new Preference(client);

        const mpItems = items.map((item: any) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
        }));

        if (shippingCost > 0) {
          mpItems.push({
            id: "ENVIO",
            title: "Costo de Envío",
            quantity: 1,
            unit_price: shippingCost,
            currency_id: "ARS",
          });
        }

        const response = await preference.create({
          body: {
            items: mpItems,
            payer: {
              name: customer.name,
              email: session?.user?.email ?? "invitado@donlucas.com",
            },
            back_urls: {
              success: `${process.env.NEXTAUTH_URL}/checkout/exito?orderId=${order.id}`,
              failure: `${process.env.NEXTAUTH_URL}/checkout/error`,
              pending: `${process.env.NEXTAUTH_URL}/checkout/exito?orderId=${order.id}`,
            },
            auto_return: "approved",
            external_reference: order.id,
          }
        });

        return NextResponse.json({ url: response.init_point, orderId: order.id }, { status: 201 });
      } catch (mpError) {
        console.error("Error MercadoPago:", mpError);
        return NextResponse.json({ error: "No se pudo iniciar el pago seguro" }, { status: 500 });
      }
    }

    return NextResponse.json({ url: `/checkout/exito?orderId=${order.id}`, orderId: order.id }, { status: 201 });

  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
