import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Edit, 
  Trash2,
  Calendar,
  User,
  MoreHorizontal,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { Blog } from "@/types/blog";

interface BlogCardProps {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
}

const blogStatuses = {
  'draft': { 
    label: 'Borrador', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock
  },
  'published': { 
    label: 'Publicado', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle
  }
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export function BlogCard({ blog, onEdit, onDelete }: BlogCardProps) {
  const statusConfig = blogStatuses[blog.status as keyof typeof blogStatuses];
  const StatusIcon = statusConfig?.icon || AlertCircle;
  const imageUrl = blog.files && blog.files.length > 0 ? blog.files[0].path : null;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <div className="w-full h-48 bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              style={{ objectFit: "cover" }}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(blog)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(blog)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-700 transition-colors">
            {blog.title}
          </CardTitle>
          <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig?.label || blog.status}
          </Badge>
        </div>
        {blog.description && (
          <CardDescription className="line-clamp-2">
            {blog.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {blog.author?.username || 'Autor desconocido'}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(blog.pubDate).toLocaleDateString()}
          </div>
        </div>
        
        {blog.content && (
          <div className="text-sm text-muted-foreground">
            <div 
              className="line-clamp-3" 
              dangerouslySetInnerHTML={{ 
                __html: truncateText(blog.content.replace(/<[^>]*>/g, ''), 120)
              }} 
            />
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Slug: <code className="bg-muted px-1 rounded">{blog.slug}</code>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}