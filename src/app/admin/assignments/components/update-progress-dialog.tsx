"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface UpdateProgressDialogProps {
  assignment: any;
  open: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
}

export function UpdateProgressDialog({
  assignment,
  open,
  onClose,
  onUpdate,
}: UpdateProgressDialogProps) {
  const [percentage, setPercentage] = useState(
    assignment?.progress?.progress_percentage || 0
  );
  const [notes, setNotes] = useState(
    assignment?.progress?.notes || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      assignmentId: assignment.id,
      progress_percentage: percentage,
      notes: notes,
    });
    onClose();
  };

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Progreso</DialogTitle>
          <DialogDescription>
            Actualiza el progreso del estudiante para esta asignación.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Estudiante</Label>
              <p className="text-sm text-muted-foreground">
                {assignment.user?.first_name} {assignment.user?.last_name}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Curso</Label>
              <p className="text-sm text-muted-foreground">
                {assignment.course?.title}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Estado</Label>
              <Badge variant="outline" className="mt-1">
                {assignment.status?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Fecha de Vencimiento</Label>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "Sin fecha de vencimiento"}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="percentage">Porcentaje de Progreso</Label>
              <Input
                id="percentage"
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value) || 0)}
                placeholder="Enter percentage (0-100)"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agrega notas sobre el progreso..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar Progreso</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}