import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // Sanitizamos el nombre original reemplazando espacios y caracteres especiales por guiones bajos
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); 
    const filename = `${uniqueSuffix}-${originalName}`;
    
    // La ruta absoluta donde se guardará (en el servidor de producción será relativa a la carpeta raíz del proyecto)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Asegurarse de que el directorio exista (crea la carpeta de forma recursiva si no existe)
    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(path.join(uploadDir, filename), buffer);

    // Retornamos la URL relativa que se usará para mostrar la imagen en el frontend
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error interno al subir el archivo" }, { status: 500 });
  }
}
