const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const email = "francodemartosutn@gmail.com";
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log(`Usuario ${user.email} promovido a ADMIN correctamente.`);
  } catch (error) {
    console.error("Error al promover usuario:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
