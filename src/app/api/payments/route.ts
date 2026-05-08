import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Esta llave debe venir del .env
// const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, distance } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No hay productos en el pedido" }, { status: 400 });
    }

    /* 
    Descomentar cuando tengamos el Access Token real en el .env:
    
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const preference = new Preference(client);

    const mpItems = items.map((item: any) => ({
      id: item.id,
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    }));

    // Agregar costo de envío como un item más
    let shippingCost = 0;
    if (distance > 3 && distance <= 7) shippingCost = 1500;
    else if (distance > 7) shippingCost = 3000;

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
          phone: { number: customer.phone },
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/exito`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/error`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/pendiente`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/webhook`,
      }
    });

    return NextResponse.json({ init_point: response.init_point });
    */

    // Mock response por ahora
    return NextResponse.json({ 
      init_point: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=MOCK_PREFERENCE",
      message: "Preferencia de MercadoPago simulada exitosamente."
    });

  } catch (error) {
    console.error("Error creating MercadoPago preference:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
