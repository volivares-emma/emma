"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Search, Plus, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Option {
  id: number;
  label: string;
  subtitle?: string;
  avatar?: string;
  data?: any;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxHeight?: string;
  disabled?: boolean;
  label?: string;
}

export function MultiSelect({
  options,
  selectedIds,
  onSelectionChange,
  placeholder = "Seleccionar elementos...",
  searchPlaceholder = "Buscar...",
  maxHeight = "300px",
  disabled = false,
  label
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filtrar opciones según búsqueda
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.subtitle && option.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Opciones seleccionadas
  const selectedOptions = options.filter(option => selectedIds.includes(option.id));

  // Manejar selección/deselección
  const handleToggleOption = (optionId: number) => {
    if (selectedIds.includes(optionId)) {
      onSelectionChange(selectedIds.filter(id => id !== optionId));
    } else {
      onSelectionChange([...selectedIds, optionId]);
    }
  };

  // Remover elemento seleccionado
  const handleRemoveSelected = (optionId: number) => {
    onSelectionChange(selectedIds.filter(id => id !== optionId));
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Limpiar búsqueda al cerrar
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <Label className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
      )}
      
      {/* Elementos seleccionados */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedOptions.map(option => (
            <Badge key={option.id} variant="secondary" className="flex items-center gap-1">
              {option.avatar && (
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-xs">
                    {option.label.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="text-xs">{option.label}</span>
              <button
                onClick={() => handleRemoveSelected(option.id)}
                className="ml-1 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Trigger button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full justify-between text-left font-normal"
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {selectedIds.length === 0 ? placeholder : `${selectedIds.length} seleccionado(s)`}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card className="relative z-50 w-full mt-1 border shadow-lg">
          <CardContent className="p-0">
            {/* Barra de búsqueda */}
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de opciones */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  {searchTerm ? "No se encontraron resultados" : "No hay opciones disponibles"}
                </div>
              ) : (
                filteredOptions.map(option => (
                  <div
                    key={option.id}
                    onClick={() => handleToggleOption(option.id)}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent transition-colors ${
                      selectedIds.includes(option.id) ? 'bg-accent' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {option.avatar && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {option.label.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{option.label}</span>
                        {option.subtitle && (
                          <span className="text-xs text-muted-foreground">{option.subtitle}</span>
                        )}
                      </div>
                    </div>
                    {selectedIds.includes(option.id) && (
                      <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer con resumen */}
            {selectedIds.length > 0 && (
              <div className="p-3 border-t bg-muted/50">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{selectedIds.length} elemento(s) seleccionado(s)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onSelectionChange([])}
                    className="h-6 px-2 text-xs"
                  >
                    Limpiar todo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}