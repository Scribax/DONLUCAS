import { PrismaClient } from '@prisma/client';

// Usamos la forma más compatible: configurar la URL en el entorno antes de instanciar
process.env.DATABASE_URL = 'file:./prisma/dev.db';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos (Seed)...');

  // 1. Zonas de Envío
  const zones = [
    { name: 'San Rafael Centro', price: 0 },
    { name: 'Cuadro Nacional', price: 500 },
    { name: 'Rama Caída', price: 800 },
    { name: 'Las Paredes', price: 600 },
    { name: 'Capitán Montoya', price: 1000 },
  ];

  for (const zone of zones) {
    await prisma.shippingZone.upsert({
      where: { name: zone.name },
      update: { price: zone.price },
      create: zone,
    });
  }
  console.log('✅ Zonas de envío cargadas.');

  // 2. Productos
  const products = [
    { 
      name: 'Maple x 30 - Grandes', 
      description: 'Huevos frescos de campo, tamaño XL. Calidad premium garantizada.', 
      price: 4500, 
      stock: 100,
      slug: 'maple-30-grandes'
    },
    { 
      name: 'Maple x 30 - Medianos', 
      description: 'Ideales para consumo diario y repostería. Frescura total.', 
      price: 4000, 
      stock: 150,
      slug: 'maple-30-medianos'
    },
    { 
      name: 'Docena de Huevos', 
      description: 'La medida justa para tu semana. Huevos seleccionados.', 
      price: 1800, 
      stock: 200,
      slug: 'docena-huevos'
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { price: product.price, stock: product.stock },
      create: product,
    });
  }
  console.log('✅ Productos cargados.');

  console.log('✨ Seed completado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
