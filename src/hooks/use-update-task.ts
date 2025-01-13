'use client'

import { useState, useEffect } from 'react';
import AxiosInstance from '@/lib/axios-instance';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";

interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  assignee: UserInfo;
}

interface UseUpdateTaskFormReturn {
  formData: TaskFormData;
  errors: Partial<Record<keyof Omit<TaskFormData, 'assignee'> | 'assignee', string>>;
  isLoading: boolean;
  isFormValid: boolean;
  handleInputChange: (field: keyof Omit<TaskFormData, 'assignee'>, value: string) => void;
  handleAssigneeChange: (assignee: UserInfo) => void;
  handleSubmit: () => Promise<void>;
  initializeForm: (data: Partial<TaskFormData>) => void;
}


const initialFormData: TaskFormData = {
  title: '',
  description: '',
  status: '',
  dueDate: '',
  dueTime: '',
  priority: '',
  assignee: {
    userId: '',
    name: '',
    email: ''
  }
};

export const useUpdateTaskForm = (): UseUpdateTaskFormReturn => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<TaskFormData, 'assignee'> | 'assignee', string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = Boolean(
      formData.title?.trim() &&
      formData.description?.trim() &&
      formData.dueDate &&
      formData.dueTime &&
      formData.priority?.trim() &&
      formData.status?.trim() &&
      formData.assignee.userId &&
      formData.assignee.name &&
      formData.assignee.email
    );
    setIsFormValid(isValid);
  }, [formData]);

  const initializeForm = (data: Partial<TaskFormData>) => {
    try {
      let adjustedDueDate = '';
      
      if (data.dueDate) {
        const date = new Date(data.dueDate);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() - userTimezoneOffset);
        adjustedDueDate = adjustedDate.toISOString();
      }
  
      let adjustedDueTime = data.dueTime || '';
      if (data.dueTime && !data.dueTime.includes('AM') && !data.dueTime.includes('PM')) {
        const [hours, minutes] = data.dueTime.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        adjustedDueTime = `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      }
  
      const formattedData = {
        title: data.title || '',
        description: data.description || '',
        status: data.status || '',
        priority: data.priority || '',
        dueDate: adjustedDueDate,
        dueTime: adjustedDueTime,
        assignee: data.assignee || initialFormData.assignee
      };
      
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
    const newErrors: Partial<Record<keyof Omit<TaskFormData, 'assignee'> | 'assignee', string>> = {};
    
    if (!formData.title?.trim()) newErrors.title = 'Required Title';
    if (!formData.description?.trim()) newErrors.description = 'Required Description';
    if (!formData.dueDate) newErrors.dueDate = 'Required Due Date';
    if (!formData.dueTime) newErrors.dueTime = 'Required Due Time';
    if (!formData.priority) newErrors.priority = 'Required Priority';
    if (!formData.status) newErrors.status = 'Required Status';

    if (!formData.assignee.userId || !formData.assignee.name || !formData.assignee.email) {
      newErrors.assignee = 'Required Assignee Information';
    }

    if (formData.priority && !['High', 'Medium', 'Low'].includes(formData.priority)) {
      newErrors.priority = 'Invalid priority value';
    }

    if (formData.status && !['Completed', 'In Progress', 'Todo', 'BackLog', 'Cancelled'].includes(formData.status)) {
      newErrors.status = 'Invalid status value';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Omit<TaskFormData, 'assignee'>, value: string) => {
    if (field === 'dueDate' && value) {
      const date = new Date(value);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(date.getTime() - userTimezoneOffset);
      
      setFormData(prev => ({
        ...prev,
        dueDate: adjustedDate.toISOString()
      }));
    } else if (field === 'dueTime' && value) {
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

  const handleAssigneeChange = (assignee: UserInfo) => {
    setFormData(prev => ({
      ...prev,
      assignee
    }));
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

      // Optimistic update
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
      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
      let errorMessage = 'Failed to update the task 👎';
      if (error instanceof AxiosError && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast({ description: errorMessage, variant: 'destructive' });
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
    handleAssigneeChange,
    handleSubmit,
    initializeForm,
  };
};