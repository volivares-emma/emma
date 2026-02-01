"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Shield,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { user } = await response.json();
          if (user.role === "guest") {
            router.push("/my-courses");
          } else if (["admin", "editor", "reader"].includes(user.role)) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        // No autenticado, continuar en login
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const getRedirectUrl = (role: string) => {
    if (role === "guest") {
      return "/my-courses";
    } else if (["admin", "editor", "reader"].includes(role)) {
      return "/admin";
    }
    return "/";
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    if (!username.trim()) {
      setErrorMsg("Por favor ingresa tu usuario o email");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Por favor ingresa tu contraseña");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setErrorMsg(data.error || 'Credenciales inválidas');
        toast.error(data.error || 'Credenciales inválidas');
        return;
      }

      if (data.success && data.user) {
        const redirectUrl = getRedirectUrl(data.user.role);
        toast.success("¡Bienvenido!");
        // Forzar recarga para que AuthContext actualice
        window.location.href = redirectUrl;
      } else {
        setLoading(false);
        setErrorMsg("Error al obtener información del usuario.");
      }
    } catch (error) {
      setLoading(false);
      setErrorMsg("Error de conexión. Intenta nuevamente.");
      toast.error("Error de conexión con el servidor");
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[90vh] grid place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
      </div>
    );
  }

  return (
    <div className="h-full">
    <div className="min-h-[90vh] grid place-items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-50 via-white to-cyan-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-sky-600 to-cyan-600 text-white">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle>Panel de Administración</CardTitle>
          <CardDescription>
            Ingresa tu usuario/email y contraseña para acceder
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit} noValidate>
          <CardContent className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive" className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {/* Usuario o Email */}
            <div className="space-y-3">
              <Label htmlFor="username">Usuario o Email</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <User className="h-4 w-4" />
                </span>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="usuario o email@ejemplo.com"
                  required
                  className="pl-9"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="space-y-3">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="pl-9 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Extras */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2">
                <Checkbox id="remember" name="remember" />
                <span className="text-sm text-muted-foreground">
                  Recuérdame
                </span>
              </label>
              <Link
                href="/admin/forgot"
                className="text-sm font-medium text-sky-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Sesión
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              © {new Date().getFullYear()} EMMA • Acceso restringido
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div className="h-full">
      <div className="min-h-[90vh] grid place-items-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-50 via-white to-cyan-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-lienar-to-br from-sky-600 to-cyan-600">
              <Skeleton className="h-6 w-6" />
            </div>
            <Skeleton className="mx-auto h-6 w-32 rounded-md" />
            <Skeleton className="mx-auto mt-2 h-4 w-48 rounded-md" />
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Usuario */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Contraseña */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Checkbox y link */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-3 w-40 rounded-md" />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
