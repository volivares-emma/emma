"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2, Plus, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { getStatusConfig, getStatusOptions, ContactStatus } from "./contact-status";

const iconMap = {
  Plus,
  Eye,
  CheckCircle,
};

interface ContactStatusSelectorProps {
  contactId: number;
  currentStatus: ContactStatus;
  onStatusChange?: (newStatus: ContactStatus) => void;
  disabled?: boolean;
}

export function ContactStatusSelector({
  contactId,
  currentStatus,
  onStatusChange,
  disabled = false
}: ContactStatusSelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<ContactStatus>(currentStatus);
  
  const currentConfig = getStatusConfig(status);
  const statusOptions = getStatusOptions();
  const CurrentIcon = iconMap[currentConfig.iconName as keyof typeof iconMap];

  const handleStatusChange = async (newStatus: ContactStatus) => {
    if (newStatus === status || isUpdating) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      setStatus(newStatus);
      onStatusChange?.(newStatus);
      
      const newConfig = getStatusConfig(newStatus);
      toast.success("Estado actualizado", {
        description: `El estado se cambió a "${newConfig.label}" correctamente.`,
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error("Error", {
        description: "No se pudo actualizar el estado del contacto.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || isUpdating}
          className="h-7 gap-1 text-xs"
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <CurrentIcon className="h-3 w-3" />
          )}
          <span>{currentConfig.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {statusOptions.map((option) => {
          const OptionIcon = iconMap[option.iconName as keyof typeof iconMap];
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value as ContactStatus)}
              disabled={option.value === status}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <OptionIcon className="h-3 w-3" />
                <span>{option.label}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}