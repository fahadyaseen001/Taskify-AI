'use client'

import { useState, useEffect } from 'react';
import AxiosInstance from '@/lib/axios-instance';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  dueTime: string;  // Separate time field
  status: string;
}

interface UseUpdateTaskFormReturn {
  formData: TaskFormData;
  errors: Partial<Record<keyof TaskFormData, string>>;
  isLoading: boolean;
  isFormValid: boolean;
  handleInputChange: (field: keyof TaskFormData, value: string) => void;
  handleSubmit: () => Promise<void>;
  initializeForm: (data: Partial<TaskFormData>) => void;
  setFormData: (data: TaskFormData) => void;  // Add this method
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  priority: '',
  dueDate: '',
  dueTime: '',  // Initialize empty time
  status: '',
};

export const useUpdateTaskForm = (): UseUpdateTaskFormReturn => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      !!formData.title.trim() &&
      !!formData.description.trim() &&
      !!formData.priority &&
      !!formData.dueDate &&
      !!formData.dueTime &&  // Validate time field
      !!formData.priority &&
      !!formData.status;
    
    setIsFormValid(isValid);
  }, [formData]);

  const initializeForm = (data: Partial<TaskFormData>) => {
    try {
      console.log('Initializing form with data:', data);
      let adjustedDueDate = '';
      
      if (data.dueDate) {
        const date = new Date(data.dueDate);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() - userTimezoneOffset);
        adjustedDueDate = adjustedDate.toISOString();
      }
  
      // Handle time format during initialization
      let adjustedDueTime = data.dueTime || '';
      if (data.dueTime && !data.dueTime.includes('AM') && !data.dueTime.includes('PM')) {
        // If time is in 24-hour format, convert it to 12-hour format
        const [hours, minutes] = data.dueTime.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        adjustedDueTime = `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      }
  
      const formattedData = {
        title: data.title || '',
        description: data.description || '',
        priority: String(data.priority || ''),
        dueDate: adjustedDueDate,
        dueTime: adjustedDueTime,
        status: String(data.status || ''),
      };
      console.log('Setting formatted data:', formattedData);
      setFormData(formattedData);
    } catch (error) {
      console.error('Error initializing form:', error);
      toast({
        description: 'Error loading task data',
        variant: 'destructive',
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.dueTime) newErrors.dueTime = 'Due time is required';  // Validate
    if (!formData.status) newErrors.status = 'Status is required';

    if (formData.priority && !['High', 'Medium', 'Low'].includes(formData.priority)) {
      newErrors.priority = 'Invalid priority value';
    }

    if (formData.status && !['Completed', 'In Progress', 'Todo', 'BackLog', 'Cancelled'].includes(formData.status)) {
      newErrors.status = 'Invalid status value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    if (field === 'dueDate' && value) {
      // Handle date input
      const date = new Date(value);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(date.getTime() - userTimezoneOffset);
      
      setFormData(prev => ({
        ...prev,
        dueDate: adjustedDate.toISOString()
      }));
    } else if (field === 'dueTime' && value) {
      // Convert 24-hour time to 12-hour format with AM/PM
      const [hours, minutes] = value.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const formattedTime = `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      
      setFormData(prev => ({
        ...prev,
        dueTime: formattedTime
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const taskId = sessionStorage.getItem('taskId');
    if (!taskId) {
      toast({ description: 'Task ID not found!', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authorization token not found');

      queryClient.setQueryData(['toDoItems'], (old: any) => 
        old?.map((task: any) => 
          task.id === taskId ? { ...task, ...formData } : task
        ) ?? []
      );

      await AxiosInstance.put(`/api/toDo/update?id=${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
      toast({ description: 'Task updated successfully 🎉' });
      router.push('/dashboard');
    } catch (error) {
      let errorMessage = 'Failed to update the task 👎';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast({ description: errorMessage, variant: 'destructive' });
      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    isFormValid,
    handleInputChange,
    handleSubmit,
    initializeForm,
    setFormData,  // Return this method
  };
};
