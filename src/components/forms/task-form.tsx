import React from 'react';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { formatDate } from '../dashboard/dashboard-utils/date-format';
import { convertTo24Hour } from '../dashboard/dashboard-utils/time-format';
import Loader from '../pages/loader';

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
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {['High', 'Medium', 'Low'].map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority}</p>
              )}
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
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
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
                      formatDate(formData.dueDate)
                    ) : (
                      <span className="text-gray-400">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Set time to noon to avoid timezone issues
                        const localDate = new Date(date.setHours(12, 0, 0, 0));
                        const userTimezoneOffset = localDate.getTimezoneOffset() * 60000;
                        const adjustedDate = new Date(localDate.getTime() - userTimezoneOffset);

                        handleInputChange('dueDate', adjustedDate.toISOString());
                      } else {
                        handleInputChange('dueDate', '');
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-3 gap-6">


          <div className="space-y-2">
              <Label htmlFor="dueTime" className="text-sm font-medium">
                Due Time
              </Label>
              <div className="flex items-center space-x-2">
               <Input
              type="time"
              id="dueTime"
              value={formData.dueTime ? convertTo24Hour(formData.dueTime) : ''}
              onChange={(e) => handleInputChange('dueTime', e.target.value)}
              className={`flex-1 ${
                !formData.dueTime
                  ? 'text-gray-400' // For both light and dark modes, empty input text is gray
                  : 'text-black dark:text-white' // In light mode, filled input text is black; in dark mode, filled input text is white
              }`}
              disabled={isLoading}
               />

              </div>
              {errors.dueTime && (
                <p className="text-sm text-red-500">{errors.dueTime}</p>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
                disabled={isLoading}
              >
                <SelectTrigger className="focus:outline-none focus:border-initial">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {['Completed', 'In Progress', 'Todo', 'BackLog', 'Cancelled'].map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status}</p>
              )}
            </div>

            

            <div className="flex justify-end items-end">
              <Button
                type="submit"
                variant="default"
                className="w-50"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <>
                   <Loader /> 
                    Creating Task...
                  </>
                ) : (
                  'Create Task'
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
