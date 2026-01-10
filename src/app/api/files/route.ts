import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile, unlink } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { existsSync } from "fs"; 
import path from "path";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file") as File;
  const related_type = form.get("related_type") as string;
  const related_id = Number(form.get("related_id"));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  if (!file || !related_type || !related_id) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  try {
    // 1. Buscar archivo existente para este related_type + related_id
    const existingFile = await prisma.tbl_files.findFirst({
      where: {
        related_type,
        related_id,
      },
    });

    // 2. Si existe archivo anterior, eliminarlo del filesystem y BD
    if (existingFile) {
      const existingFilePath = path.join(process.cwd(), "public", existingFile.path);
      
      // Eliminar archivo físico si existe
      try {
        if (existsSync(existingFilePath)) {
          await unlink(existingFilePath);
          console.log(`Archivo eliminado: ${existingFilePath}`);
        }
      } catch (fsError) {
        console.error("Error al eliminar archivo físico:", fsError);
      }

      // Eliminar registro de BD
      await prisma.tbl_files.delete({
        where: {
          id: existingFile.id,
        },
      });
      console.log(`Registro eliminado de BD: ${existingFile.id}`);
    }

    // 3. Convertir el nuevo archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Generar nombre seguro (uuid + extensión original)
    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;

    // 5. Guardar en carpeta segura
    const uploadDir = path.join(process.cwd(), "public", "uploads", related_type);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // 6. Guardar nuevo registro en BD
    const dbFile = await prisma.tbl_files.create({
      data: {
        filename,
        path: `/uploads/${related_type}/${filename}`,
        related_type,
        related_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    console.log(`Nuevo archivo guardado: ${filename} para ${related_type}:${related_id}`);
    return NextResponse.json(dbFile, { status: 201 });
  } catch (error) {
    console.error("Error en POST /files:", error);
    return NextResponse.json(
      { error: "Error al procesar archivo" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const related_type = searchParams.get("related_type");
    const related_id = searchParams.get("related_id");

    // Validar parámetros
    if (!related_type || !related_id) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    // Obtener solo el archivo más reciente para este related_type + related_id
    const file = await prisma.tbl_files.findFirst({
      where: {
        related_type,
        related_id: Number(related_id),
      },
      orderBy: { created_at: "desc" }, // El más reciente
    });

    // Devolver como array para mantener compatibilidad con el código existente
    const files = file ? [file] : [];
    return NextResponse.json(files, { status: 200 });
  } catch (err) {
    console.error("GET /files error:", err);
    return NextResponse.json(
      { error: "Error al obtener archivos" },
      { status: 500 }
    );
  }
}