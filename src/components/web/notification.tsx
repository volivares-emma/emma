"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, Info, BadgePercent, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Notification as NotificationType } from "@/types/notification";
import SkeletonNotification from "../loading/skeleton-notification";
import clsx from "clsx";

// Tipos de variante de notificación
type Variant = "system" | "news" | "event" | "promotion" | "warning";

const ICONS: Record<Variant, React.ComponentType<{ className?: string }>> = {
  system: AlertCircle,
  news: Info,
  event: CheckCircle2,
  promotion: BadgePercent,
  warning: AlertCircle,
};

const THEME: Record<Variant, { sectionBg: string; ring: string; iconColor: string }> = {
  system: { sectionBg: "bg-blue-700", ring: "ring-blue-400", iconColor: "text-white" },
  news: { sectionBg: "bg-sky-700", ring: "ring-sky-400", iconColor: "text-white" },
  event: { sectionBg: "bg-emerald-700", ring: "ring-emerald-400", iconColor: "text-white" },
  promotion: { sectionBg: "bg-indigo-700", ring: "ring-indigo-400", iconColor: "text-white" },
  warning: { sectionBg: "bg-rose-700", ring: "ring-rose-400", iconColor: "text-white" },
};

function coerceVariant(v?: string): Variant {
  const s = (v ?? "").toLowerCase() as Variant;
  return ["system", "news", "event", "promotion", "warning"].includes(s) ? s : "system";
}

export default function Notification() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [closedIds, setClosedIds] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/notifications", { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((payload) => {
        if (!isMounted) return;
        const raw: NotificationType[] = payload?.data || [];
        setNotifications(raw);
      })
      .catch(() => {
        if (!isMounted) return;
        setNotifications([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Derivado: solo activas y no cerradas
  const active = useMemo(
    () => notifications.filter((n) => !closedIds.includes(n.id) && (n as any).isActive !== false),
    [notifications, closedIds]
  );

  const handleClose = useCallback((id: number) => {
    setClosedIds((ids) => (ids.includes(id) ? ids : [...ids, id]));
  }, []);

  // Importante: primero mostramos el skeleton; si no, nunca lo verás.
  if (loading) return <SkeletonNotification />;
  if (!loading && active.length === 0) return null;

  const mainVariant = coerceVariant((active[0] as any)?.notificationType);
  const theme = THEME[mainVariant];

  return (
    <section aria-label="Notificaciones" className={clsx(theme.sectionBg, theme.ring, "ring-1")}>
      <div className="mx-auto w-full max-w-screen-2xl sm:px-6 lg:px-8">
        {active.map((n) => {
          const v = coerceVariant((n as any).notificationType);
          const Icon = ICONS[v];
          const t = THEME[v];

          return (
            <div
              key={n.id}
              role={v === "warning" ? "alert" : "status"}
              className="w-full p-3 sm:p-4 md:p-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] animate-fade-in"
            >
              {/* Izquierda: icono + textos */}
              <div className="flex min-w-0 items-start gap-3 md:gap-4">
                <div className={clsx("mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2", t.iconColor, "bg-white/10 ring-white/25") }>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold leading-tight text-white line-clamp-2">{n.title}</h4>
                  {n.description && (
                    <p className=" text-xs leading-relaxed text-white/80 line-clamp-3 md:line-clamp-2">{n.description}</p>
                  )}
                </div>
              </div>
              {/* Derecha: acciones */}
              <div className="flex w-full flex-col items-stretch justify-center gap-2 md:w-auto md:flex-row md:items-center md:justify-end">
                {n.actionText && n.actionUrl && (
                  <Button
                    asChild
                    size="sm"
                    className="rounded-2xl px-4 sm:px-6 font-medium bg-white text-black hover:bg-white/90 w-full md:w-auto"
                  >
                    <a href={n.actionUrl} target="_blank" rel="noopener noreferrer">
                      {n.actionText}
                    </a>
                  </Button>
                )}
                {(n as any).dismissible !== false && (
                  <button
                    onClick={() => handleClose(n.id)}
                    className="h-9 w-9 rounded-full text-white/80 hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 ml-auto md:ml-0"
                    aria-label="Cerrar notificación"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
