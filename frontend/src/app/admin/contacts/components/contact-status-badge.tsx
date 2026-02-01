import { Badge } from "@/components/ui/badge";
import { getStatusConfig, ContactStatus } from "./contact-status";
import { Plus, Eye, CheckCircle } from "lucide-react";

const iconMap = {
  Plus,
  Eye,
  CheckCircle,
};

interface ContactStatusBadgeProps {
  status: ContactStatus;
  className?: string;
}

export function ContactStatusBadge({ status, className }: ContactStatusBadgeProps) {
  const config = getStatusConfig(status);
  const IconComponent = iconMap[config.iconName as keyof typeof iconMap];
  
  return (
    <Badge 
      className={`${config.color} ${className}`}
      variant="outline"
    >
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}