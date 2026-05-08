const { prisma } = require("./src/lib/prisma");

async function main() {
  try {
    console.log("Intentando conectar a la base de datos...");
    const count = await prisma.shippingZone.count();
    console.log("Conexión exitosa. Zonas encontradas:", count);
    const zones = await prisma.shippingZone.findMany();
    console.log("Zonas:", JSON.stringify(zones, null, 2));
  } catch (error) {
    console.error("ERROR DETECTADO EN PRISMA:");
    console.error(error);
  } finally {
    process.exit();
  }
}

main();
