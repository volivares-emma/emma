"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users, BookOpen } from "lucide-react";

interface AssignCourseDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (data: any) => void;
  users: any[];
  courses: any[];
}

export function AssignCourseDialog({
  open,
  onClose,
  onAssign,
  users,
  courses,
}: AssignCourseDialogProps) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedCourse("");
      setSelectedUsers([]);
      setDueDate("");
      setSelectAll(false);
    }
  }, [open]);

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id.toString()));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || selectedUsers.length === 0) {
      return;
    }

    onAssign({
      courseId: parseInt(selectedCourse),
      userIds: selectedUsers.map(id => parseInt(id)),
      dueDate: dueDate || null,
    });

    onClose();
  };

  const selectedCourseData = courses.find(course => course.id.toString() === selectedCourse);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Asignar curso a estudiantes</DialogTitle>
          <DialogDescription>
            Selecciona un curso y elige los estudiantes a los que asignarlo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
          {/* Course Selection */}
          <div className="space-y-2">
            <Label htmlFor="course">Curso</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCourseData && (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedCourseData.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCourseData.description}
                    </p>
                    {selectedCourseData.category && (
                      <Badge variant="outline" className="mt-1">
                        {selectedCourseData.category}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>{selectedCourseData.duration_hours}h duration</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">Fecha de Vencimiento (Opcional)</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* User Selection */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <Label>Estudiantes ({selectedUsers.length} seleccionados)</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="selectAll" className="text-sm cursor-pointer">
                  Seleccionar todo
                </Label>
              </div>
            </div>

            <ScrollArea className="border rounded-md h-[200px]">
              <div className="p-3 space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 py-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id.toString())}
                      onCheckedChange={(checked) => 
                        handleUserToggle(user.id.toString(), checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor={`user-${user.id}`} 
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            @{user.username} • {user.role}
                          </span>
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}

                {users.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay usuarios disponibles</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedCourse || selectedUsers.length === 0}
            >
              Asignar curso ({selectedUsers.length} estudiante{selectedUsers.length !== 1 ? 's' : ''})
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}