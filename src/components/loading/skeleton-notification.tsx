// Skeleton de loading para Notifications adaptado al diseño del banner
export default function SkeletonNotification() {
  return (
    <section aria-label="Notificaciones" className="bg-linear-to-r from-blue-700 via-blue-700/95 to-blue-700/90 ring-blue-400 ring-1">
      <div className="mx-auto w-full max-w-screen-2xl sm:px-6 lg:px-8">
          <div className="w-full p-3 sm:p-4 md:p-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] animate-fade-in">
            {/* Izquierda: icono + textos */}
            <div className="flex min-w-0 items-start gap-3 md:gap-4">
              <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 bg-white/10 ring-white/25 animate-pulse" />
              <div className="min-w-0">
                <div className="h-4 w-32 bg-white/20 rounded mb-2 animate-pulse" />
                <div className="h-3 w-48 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
            {/* Derecha: acciones */}
            <div className="flex w-full flex-col items-stretch justify-center gap-2 md:w-auto md:flex-row md:items-center md:justify-end">
              <div className="h-9 w-24 bg-white/20 rounded-2xl animate-pulse" />
              <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
      </div>
    </section>
  );
}
