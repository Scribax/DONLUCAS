import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Usamos la forma más compatible: configurar la URL en el entorno antes de instanciar
process.env.DATABASE_URL = 'file:./prisma/dev.db';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@donlucas.com';
  const password = 'admin123';
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: 'Administrador Don Lucas',
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log('✅ Usuario Administrador creado con éxito!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
  } catch (error) {
    console.error('❌ Error al crear el administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
