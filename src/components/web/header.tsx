"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Home,
  Users,
  Mail,
  Newspaper,
  Eye,
  Rocket,
  Menu,
  X,
  BookOpen,
  User,
  LogOut,
  LogIn,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    toast.promise(
      signOut({ callbackUrl: '/' }),
      {
        loading: 'Cerrando sesión...',
        success: '¡Sesión cerrada exitosamente!',
        error: 'Error al cerrar sesión',
      }
    );
  };
  
  const linkBase =
    "text-[#035AA6] hover:text-[#11B4D9] transition-colors font-medium flex items-center";
  
  const NavLink = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: any;
  }) => (
    <Link
      href={href}
      className={`${linkBase} ${pathname === href ? "text-[#11B4D9]" : ""}`}
      onClick={() => setOpen(false)}
    >
      <Icon className="mr-2 h-4 w-4" aria-hidden />
      {label}
    </Link>
  );

  // Manejo seguro del estado de autenticación
  const isAuthenticated = status === "authenticated" && session;
  const isLoading = status === "loading";
  const isUnauthenticated = status === "unauthenticated";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#11B4D9]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo.png"
                alt="EMMA HR Logo"
                width={124}
                height={46}
                className="h-10 w-auto object-contain drop-shadow-lg"
                priority
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Inicio" icon={Home} />
            <NavLink href="/about" label="Nosotros" icon={Users} />
            <NavLink href="/contact" label="Contacto" icon={Mail} />
            <NavLink href="/blog" label="Blog" icon={Newspaper} />
            {isAuthenticated && (
              <NavLink href="/my-courses" label="Mis Cursos" icon={BookOpen} />
            )}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-[#035AA6]">
                      {session?.user?.name || session?.user?.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/my-courses" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Mis Cursos
                    </Link>
                  </DropdownMenuItem>
                  {(session?.user?.role === 'admin' || session?.user?.role === 'editor' || session?.user?.role === 'reader') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isUnauthenticated ? (
              <>
                {/* <Link
                  href="https://emmahr.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#11B4D9] hover:text-[#035AA6] font-medium text-sm flex items-center group"
                >
                  <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Ver Prototipo
                </Link> */}

                <Button asChild variant="outline" className="mr-2">
                  <Link href="/login">
                    Iniciar Sesión
                  </Link>
                </Button>

                <Button
                  asChild
                  className="bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:from-[#07598C] hover:to-[#11B4D9]"
                >
                  <Link
                    href="/contact"
                    className="text-sm font-medium flex items-center"
                  >
                    <Rocket className="h-4 w-4" />
                    Únete al Beta
                  </Link>
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile trigger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                  <Menu className="h-6 w-6 text-[#035AA6]" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[88%] sm:w-95 p-0">
                <SheetHeader className="p-6 border-b border-[#11B4D9]/20">
                  <SheetDescription>
                    <Image
                      src="/logo.png"
                      alt="EMMA HR Logo"
                      width={124}
                      height={46}
                      priority
                    />
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile nav */}
                <div className="flex-1 px-6 py-8 space-y-6">
                  <NavLink href="/" label="Inicio" icon={Home} />
                  <NavLink href="/about" label="Nosotros" icon={Users} />
                  <NavLink href="/contact" label="Contacto" icon={Mail} />
                  <NavLink href="/blog" label="Blog" icon={Newspaper} />
                  {isAuthenticated && (
                    <NavLink href="/my-courses" label="Mis Cursos" icon={BookOpen} />
                  )}
                  <hr className="border-[#11B4D9]/20" />
                  {isLoading ? (
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : isAuthenticated ? (
                    <>
                      {(session?.user?.role === 'admin' || session?.user?.role === 'editor' || session?.user?.role === 'reader') && (
                        <NavLink href="/admin" label="Panel Admin" icon={Settings} />
                      )}
                      <button
                        onClick={handleSignOut}
                        className={`${linkBase} text-lg text-red-600 hover:text-red-700 w-full justify-start`}
                      >
                        <LogOut className="mr-4 h-5 w-5" />
                        Cerrar Sesión
                      </button>
                    </>
                  ) : isUnauthenticated ? (
                    <>
                      <Link
                        href="/login"
                        className={`${linkBase} text-lg`}
                      >
                        <LogIn className="mr-4 h-5 w-5" />
                        Iniciar Sesión
                      </Link>
                      <Link
                        href="https://emmahr.net/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${linkBase} text-lg`}
                      >
                        <Eye className="mr-4 h-5 w-5" />
                        Ver Prototipo
                      </Link>
                    </>
                  ) : null}
                </div>
                <div className="flex flex-col md:hidden px-6 py-4 border-t border-[#11B4D9]/20">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <Eye className="mr-4 h-5 w-5 text-[#11B4D9]" />
                      Ver Prototipo
                    </div>
                  )
                  : (
                    <>
                      <Link
                        href="/login"
                        className={`${linkBase} text-lg`}
                      >
                        <LogIn className="mr-4 h-5 w-5" />
                        Iniciar Sesión
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile footer */}
                <div className="px-6 py-6 border-t border-[#11B4D9]/20 bg-[#11B4D9]/5">
                  {isAuthenticated ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-[#035AA6]">
                          {session?.user?.name || session?.user?.email}
                        </span>
                      </div>
                    </div>
                  ) : isUnauthenticated ? (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full mb-3"
                      >
                        <Link href="/login">
                          Iniciar Sesión
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-linear-to-r from-[#035AA6] to-[#11B4D9] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-[#07598C] hover:to-[#11B4D9]"
                      >
                        <Link
                          href="/contact"
                          className="flex items-center justify-center"
                        >
                          <Rocket className="mr-2 h-5 w-5" />
                          Únete al Beta
                        </Link>
                      </Button>
                    </>
                  ) : null}
                  <div className="mt-4 text-center">
                    <span className="text-xs text-[#07598C]">
                      EMMA • Employee Management Monitoring & Administration
                    </span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
