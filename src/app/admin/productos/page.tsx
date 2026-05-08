import { prisma } from "@/lib/prisma";
import ProductManager from "./ProductManager";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });

  return <ProductManager initialProducts={products} />;
}
