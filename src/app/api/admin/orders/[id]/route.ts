import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = params;
    const { status } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    // Actualizar el pedido
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    // Lógica de Fidelización: Si el pedido se marca como ENTREGADO, sumamos puntos al usuario
    if (status === "DELIVERED" && order.userId && order.status !== "DELIVERED") {
      // Sumamos 1 punto por cada $100 gastados (ejemplo)
      const pointsToAdd = Math.floor(order.totalAmount / 100);
      
      await prisma.user.update({
        where: { id: order.userId },
        data: {
          points: { increment: pointsToAdd }
        }
      });

      // También registramos los puntos en la orden
      await prisma.order.update({
        where: { id },
        data: { pointsEarned: pointsToAdd }
      });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
