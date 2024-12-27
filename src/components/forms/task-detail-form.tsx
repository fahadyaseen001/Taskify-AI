"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateTaskForm } from "@/hooks/use-update-task";

interface TaskFormData {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  isCompleted: boolean;
}

const TaskDetailForm = () => {
  const params = useParams();
  const taskId = params?.id as string || '';
  
  const {
    formData,
    errors,
    isLoading,
    isFormValid,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useUpdateTaskForm();

  useEffect(() => {
    if (taskId) {
      sessionStorage.setItem('taskId', taskId);  // Store the taskId in sessionStorage
    }
  }, [taskId]);

  useEffect(() => {
    const taskData = sessionStorage.getItem(`task-${taskId}`);
    if (taskData) {
      const parsedData = JSON.parse(taskData);
      resetForm();
      Object.keys(parsedData).forEach(key => {
        if (key in formData) {
          handleInputChange(key as keyof TaskFormData, parsedData[key]);
        }
      });
    }
  }, [taskId]);

  const handleSubmitWrapper = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        <form onSubmit={handleSubmitWrapper} className="p-6 space-y-6">
          <div className="text-2xl font-bold mb-6">Update Task</div>
          
          {/* First Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title"
                disabled={isLoading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority Level
              </Label>
              <Select
                value={formData.priority.toString()}
                onValueChange={(value) => handleInputChange('priority', parseInt(value, 10))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-red-500 text-sm mt-1">{errors.priority}</p>}
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="h-24"
                placeholder="Enter task description"
                disabled={isLoading}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={isLoading}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      new Date(formData.dueDate).toLocaleDateString()
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                    onSelect={(date) => handleInputChange('dueDate', date?.toISOString() || '')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Third Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isCompleted"
                checked={formData.isCompleted}
                onCheckedChange={(checked) => 
                  handleInputChange('isCompleted', checked === true)
                }
                disabled={isLoading}
              />
              <Label htmlFor="isCompleted" className="text-sm font-medium">
                Mark as completed
              </Label>
            </div>
            
            <div className="space-x-4">
              <Button 
                type="submit"
                variant="default"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? "Updating Task..." : "Update Task"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskDetailForm;
