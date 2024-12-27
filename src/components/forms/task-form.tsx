"use client"

import React from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { useTodoForm } from '@/hooks/use-create-task';

const TaskForm = () => {
  const {
    formData,
    errors,
    isLoading,
    isFormValid,
    handleInputChange,
    handleSubmit,
  } = useTodoForm();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="text-2xl font-bold mb-6">Create New Task</div>
          
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
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority Level
              </Label>
              <Select
                value={formData.priority?.toString()}
                onValueChange={(value) => handleInputChange('priority', parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5,6,7,8,9,10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                    {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
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
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
                    selected={new Date(formData.dueDate)}
                    onSelect={(date) => handleInputChange('dueDate', date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
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
            
            <Button 
              type="submit"
              variant="default" 
              className="w-50"
              disabled={!isFormValid || isLoading}
            >
             {isLoading ? (
              <>
                <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500 dark:text-black-500" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Task...
              </>
            ) : (
              "Create Task"
            )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;