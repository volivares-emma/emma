// lib/upload.ts
import path from "path";
import { mkdir, writeFile } from "fs/promises";

export interface SavedFile {
  filename: string;
  path: string;
}

/**
 * Guarda un archivo subido en /public/uploads/<model>
 * @param file File proveniente de formData
 * @param model Nombre del modelo/carpeta donde guardarlo (por defecto "general")
 * @returns { filename, path }
 */
export async function saveUploadedFile(file: File, model = "general"): Promise<SavedFile> {
  // Carpeta final: /public/uploads/<model>
  const uploadPath = path.join(process.cwd(), "public", "uploads", model);
  await mkdir(uploadPath, { recursive: true });

  // Buffer y nombre seguro
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
  const filename = `${Date.now()}-${safeName}`;
  const fsPath = path.join(uploadPath, filename);

  await writeFile(fsPath, buffer);

  return {
    filename,
    path: `/uploads/${model}/${filename}`, // ruta pública
  };
}
