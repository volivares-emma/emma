import Image from "next/image";
import Link from "next/link";
import { Home, Users, Mail, Newspaper, Globe, AtSign, Server } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const year = new Date().getFullYear();

  const linkBase = "text-[#035AA6] hover:text-[#11B4D9] transition-colors";

  return (
    <footer className="bg-linear-to-br from-[#035AA6]/5 via-white to-[#11B4D9]/10 border-t border-[#11B4D9]/20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Información de la empresa */}
          <div className="md:col-span-2">
            <Image
              src="/logo.png"
              alt="EMMA HR Logo"
              width={124}
              height={46}
              className="h-12 w-auto mb-4 select-none drop-shadow-lg"
              priority
            />
            <div className="text-sm text-[#07598C] font-medium">
              <span className="font-bold text-[#035AA6]">EMMA</span> [Employee Management Monitoring & Administration]
            </div>
            <p className="text-slate-700 max-w-md mt-1">
              Plataforma de RR. HH. para gestionar empleados, asistencia, nómina y reclutamiento con una experiencia simple y segura.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-sm font-semibold text-[#11B4D9] tracking-wider uppercase mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4" aria-hidden /> Navegación
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/" className={linkBase}>
                  <span className="inline-flex items-center gap-2"><Home className="h-4 w-4" /> Inicio</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkBase}>
                  <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Nosotros</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkBase}>
                  <span className="inline-flex items-center gap-2"><Newspaper className="h-4 w-4" /> Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkBase}>
                  <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Contacto</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-sm font-semibold text-[#11B4D9] tracking-wider uppercase mb-4 flex items-center gap-2">
              <AtSign className="h-4 w-4" aria-hidden /> Información
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="https://descubre.emma.pe" target="_blank" rel="noopener noreferrer" className={linkBase}>
                  Sitio Web
                </Link>
              </li>
              <li>
                <Link href="mailto:info@emma.pe" className={linkBase}>
                  info@emma.pe
                </Link>
              </li>
              <li><span className="text-[#07598C]">RRHH Digital</span></li>
              <li><span className="text-[#07598C]">Gestión de Talento</span></li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="mt-8 pt-8">
          <Separator className="bg-[#11B4D9]/20" />
          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#07598C]">&copy; {year} EMMA. Todos los derechos reservados.</p>
            <div className="text-sm text-[#035AA6]">
              Desarrollado por {" "}
              <Link
                href="https://codevo.pe"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#11B4D9] font-semibold"
              >
                Codevo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
