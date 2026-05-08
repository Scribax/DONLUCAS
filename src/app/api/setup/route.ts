import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🚀 Iniciando Setup Automático...");

    // 1. Crear Admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@donlucas.com" },
      update: {},
      create: {
        name: "Administrador Don Lucas",
        email: "admin@donlucas.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // 2. Crear Zonas
    const zones = [
      { name: "San Rafael Centro", price: 0 },
      { name: "Cuadro Nacional", price: 500 },
      { name: "Rama Caída", price: 800 },
      { name: "Las Paredes", price: 600 },
    ];

    for (const zone of zones) {
      await prisma.shippingZone.upsert({
        where: { name: zone.name },
        update: { price: zone.price },
        create: zone,
      });
    }

    // 3. Crear Productos
    const products = [
      { 
        name: "Maple x 30 - Grandes", 
        description: "Huevos frescos de campo, tamaño XL. Calidad premium.", 
        price: 4500, 
        stock: 100 
      },
      { 
        name: "Maple x 30 - Medianos", 
        description: "Ideales para consumo diario. Frescura garantizada.", 
        price: 4000, 
        stock: 150 
      },
    ];

    for (const p of products) {
      await prisma.product.create({
        data: p
      });
    }

    return NextResponse.json({ 
      status: "success", 
      message: "¡Setup completado con éxito!",
      admin: admin.email,
      password: "admin123 (Cámbiala luego)"
    });

  } catch (error: any) {
    console.error("❌ Error en Setup:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error.message 
    }, { status: 500 });
  }
}
