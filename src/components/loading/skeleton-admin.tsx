// src/components/shared/ComponentSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

interface ComponentSkeletonProps {
  avatar?: boolean;      // si debe mostrar un avatar circular
  lines?: number;        // cuántas líneas de texto simular
  withButton?: boolean;  // si debe incluir un botón al final
  image?: boolean;       // si debe incluir un bloque tipo imagen
}

export default function ComponentSkeleton({
  avatar = false,
  lines = 3,
  withButton = false,
  image = false,
}: ComponentSkeletonProps) {
  return (
    <div className="w-full rounded-xl border shadow-sm p-4 space-y-4">
      {/* Imagen / banner */}
      {image && <Skeleton className="h-40 w-full rounded-lg" />}

      <div className="space-y-3">
        {/* Avatar opcional */}
        {avatar && (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
        )}

        {/* Líneas dinámicas */}
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full rounded-md" />
        ))}

        {/* Botón opcional */}
        {withButton && (
          <Skeleton className="h-9 w-24 rounded-lg" />
        )}
      </div>
    </div>
  );
}
