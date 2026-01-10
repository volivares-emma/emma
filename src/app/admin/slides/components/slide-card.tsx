import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pencil,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  Users,
  Lightbulb,
  Monitor,
  GripVertical,
} from "lucide-react";
import type { Slide } from "@/types/slide";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Configuración de tipos visuales
const visualTypeConfig = {
  dashboard: {
    label: "Dashboard",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: Monitor,
  },
  analytics: {
    label: "Analytics",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: BarChart3,
  },
  team: {
    label: "Team",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: Users,
  },
  growth: {
    label: "Growth",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: TrendingUp,
  },
  innovation: {
    label: "Innovation",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Lightbulb,
  },
};

type SlideCardProps = {
  slide: Slide;
  onEdit: (slide: Slide) => void;
  onToggleStatus: (slide: Slide) => void;
  onDelete: (slide: Slide) => void;
};

export function SlideCard({
  slide,
  onEdit,
  onToggleStatus,
  onDelete,
}: SlideCardProps) {
  const typeConfig = visualTypeConfig[slide.visualType];
  const TypeIcon = typeConfig.icon;
  const imageUrl =
    slide.files && slide.files.length > 0 ? slide.files[0].path : null;

  return (
    <Card
      key={slide.id}
      className={`group hover:shadow-lg transition-all duration-200 ${
        !slide.isActive ? "opacity-60" : ""
      }`}
    >
      {/* Imagen */}
      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-linear-to-br from-gray-100 to-gray-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={slide.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {/* Estado */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={slide.isActive ? "default" : "secondary"}
            className="gap-1"
          >
            {slide.isActive ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
            {slide.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        {/* Orden */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            #{slide.sortOrder}
          </Badge>
        </div>

        {/* Dropdown */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
              >
                <GripVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(slide)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(slide)}>
                {slide.isActive ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {slide.isActive ? "Desactivar" : "Activar"}
              </DropdownMenuItem>
              {slide.buttonLink && (
                <DropdownMenuItem asChild>
                  <a
                    href={slide.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver enlace
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(slide)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contenido */}
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="overflow-hidden text-ellipsis flex-1 min-w-0">
              {slide.title}
            </CardTitle>
            <Badge className={`${typeConfig.color} shrink-0`} variant="outline">
              <TypeIcon className="w-3 h-3 mr-1" />
              {typeConfig.label}
            </Badge>
          </div>
          <CardDescription className="text-xs line-clamp-1">
            {slide.subtitle}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {slide.description}
        </p>

        {slide.buttonText && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span className="truncate">{slide.buttonText}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
