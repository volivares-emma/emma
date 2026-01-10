"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Home,
  Images,
  LayoutDashboard,
  Mail,
  MailPlus,
  Megaphone,
  MessageSquareQuote,
  Newspaper,
  UserCog,
  Users,
  PersonStanding,
  BookOpen,
  UserCheck,
  Award,
  FileText,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Define the type for navigation items
type NavItem = {
  href?: string;
  label?: string;
  icon?: React.ElementType;
  separator?: boolean;
  external?: boolean;
};

// Your navigation items
const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/slides", label: "Slides", icon: Images },
  { href: "/admin/testimonials", label: "Testimonios", icon: MessageSquareQuote},
  { href: "/admin/notifications", label: "Notificaciones", icon: Megaphone },
  { separator: true },
  { href: "/admin/courses", label: "Cursos", icon: BookOpen },
  { href: "/admin/assignments", label: "Asignaciones", icon: UserCheck },
  { href: "/admin/certificates", label: "Certificados", icon: Award },
  { href: "/admin/reports", label: "Reportes", icon: FileText },
  { separator: true },
  { href: "/admin/job-positions", label: "Posiciones", icon: Briefcase },
  { href: "/admin/recruitments", label: "Reclutamiento", icon: Users },
  { separator: true },
  { href: "/admin/subscriptions", label: "Suscripciones", icon: MailPlus },
  { href: "/admin/contacts", label: "Contactos", icon: Mail },
  { href: "/admin/users", label: "Usuarios", icon: UserCog },
  { href: "/", label: "Sitio Web", icon: Home, external: true },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Configurar datos del usuario desde la sesión
  const user = React.useMemo(() => {
    if (status === "loading") {
      return {
        name: "Cargando...",
        email: "",
        avatar: "/avatar.png",
      };
      } else if (session?.user) {
      // Usar el nombre de la sesión directamente
      const displayName = session.user.name || session.user.email || "Usuario";
      
      return {
        name: displayName,
        email: session.user.email || "",
        avatar: "/avatar.png",
      };
    } else {
      return {
        name: "Usuario no autenticado",
        email: "",
        avatar: "/avatar.png",
      };
    }
  }, [session, status]);

  const navMainItems = NAV_ITEMS.map((item) => {
    if (item.separator) {
      return { separator: true };
    }
    return {
      title: item.label,
      url: item.href,
      icon: item.icon,
      isActive: pathname === item.href,
      external: item.external,
    };
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <PersonStanding className="size-5!" />
                <span className="text-base font-semibold">EMMA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
