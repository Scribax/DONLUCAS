import { prisma } from "../src/lib/prisma";

async function test() {
  try {
    console.log("--- TEST PRISMA ---");
    const zones = await prisma.shippingZone.findMany();
    console.log("Zonas encontradas:", zones.length);
    console.log(zones);
  } catch (err) {
    console.error("ERROR EN TEST:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
