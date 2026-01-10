import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    console.log("Iniciando limpieza de archivos duplicados...");

    // Obtener todos los archivos agrupados por related_type + related_id
    const allFiles = await prisma.tbl_files.findMany({
      orderBy: [
        { related_type: "asc" },
        { related_id: "asc" },
        { created_at: "desc" }, // El más reciente primero
      ],
    });

    const filesToDelete: { id: number; path: string; reason: string }[] = [];
    const groupedFiles = new Map<string, typeof allFiles>();

    // Agrupar archivos por related_type + related_id
    for (const file of allFiles) {
      const key = `${file.related_type}:${file.related_id}`;

      if (!groupedFiles.has(key)) {
        groupedFiles.set(key, []);
      }

      groupedFiles.get(key)!.push(file);
    }

    // Para cada grupo, mantener solo el más reciente
    for (const [key, files] of groupedFiles) {
      if (files.length > 1) {
        // Mantener el primer archivo (más reciente) y marcar el resto para eliminar
        const [keepFile, ...deleteFiles] = files;

        console.log(
          `${key}: Manteniendo ${keepFile.filename} (${keepFile.created_at})`
        );

        for (const fileToDelete of deleteFiles) {
          filesToDelete.push({
            id: fileToDelete.id,
            path: fileToDelete.path,
            reason: `Duplicado en ${key} - ${fileToDelete.filename} (${fileToDelete.created_at})`,
          });
        }
      }
    }

    console.log(`🗑️  Archivos a eliminar: ${filesToDelete.length}`);

    let deletedFiles = 0;
    let deletedFromFS = 0;
    let errors: string[] = [];

    // Eliminar archivos duplicados
    for (const fileToDelete of filesToDelete) {
      try {
        // Eliminar archivo físico
        const fullPath = path.join(process.cwd(), "public", fileToDelete.path);
        if (existsSync(fullPath)) {
          await unlink(fullPath);
          deletedFromFS++;
          console.log(`Archivo físico eliminado: ${fullPath}`);
        }

        // Eliminar registro de BD
        await prisma.tbl_files.delete({
          where: { id: fileToDelete.id },
        });

        deletedFiles++;
        console.log(`${fileToDelete.reason}`);
      } catch (error) {
        const errorMsg = `Error eliminando ${fileToDelete.path}: ${error}`;
        errors.push(errorMsg);
        console.error(`${errorMsg}`);
      }
    }

    const result = {
      success: true,
      message: "Limpieza de archivos completada",
      summary: {
        totalChecked: allFiles.length,
        duplicatesFound: filesToDelete.length,
        deletedFromDB: deletedFiles,
        deletedFromFileSystem: deletedFromFS,
        errors: errors.length,
      },
      details: {
        errors: errors.length > 0 ? errors : undefined,
        groupsProcessed: Array.from(groupedFiles.keys()),
      },
    };

    console.log("Limpieza completada:", result.summary);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error en limpieza:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error durante la limpieza",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
