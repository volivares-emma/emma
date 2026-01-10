"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, Phone, User, Shield, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  is_active: boolean;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserProfile();
    }
  }, [session]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/account");
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session?.user || !userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  const getInitials = (name?: string, email?: string) => {
    if (name && name !== "Usuario") {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    } else if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (userProfile.first_name || userProfile.last_name) {
      return [userProfile.first_name, userProfile.last_name].filter(Boolean).join(" ");
    }
    return userProfile.username || session.user.name || "Usuario";
  };

  const getRoleLabel = (role: string) => {
    const roleMap = {
      admin: "Administrador",
      editor: "Editor", 
      reader: "Lector",
      guest: "Invitado"
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleColor = (role: string) => {
    const colorMap = {
      admin: "bg-red-100 text-red-800 border-red-200",
      editor: "bg-blue-100 text-blue-800 border-blue-200",
      reader: "bg-green-100 text-green-800 border-green-200",
      guest: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colorMap[role as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const handleEdit = () => {
    setFormData({
      first_name: userProfile.first_name || "",
      last_name: userProfile.last_name || "",
      email: userProfile.email || "",
      phone: userProfile.phone || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        toast.success("¡Perfil actualizado exitosamente!");
        setIsEditing(false);
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile.avatar_url || "/avatar.png"} alt={getDisplayName()} />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(getDisplayName(), userProfile.email)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{getDisplayName()}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              {userProfile.email || userProfile.username}
            </CardDescription>
            <div className="flex justify-center mt-3">
              <Badge variant="outline" className={getRoleColor(userProfile.role)}>
                <Shield className="h-3 w-3 mr-1" />
                {getRoleLabel(userProfile.role)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Information Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Tu información de perfil y datos de contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">Nombre</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Apellido</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Nombre Completo</p>
                    <p className="text-gray-600">{getDisplayName()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">{userProfile.email || "No especificado"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <p className="text-gray-600">{userProfile.phone || "No especificado"}</p>
                  </div>
                </div>

                <Separator />
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Miembro desde</p>
                    <p className="text-gray-600">
                      {new Date(userProfile.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}