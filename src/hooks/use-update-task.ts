"use client"

import { useState, useEffect } from 'react';
import AxiosInstance from '@/lib/axios-instance';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";  // Import useQueryClient

interface TaskFormData {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
  isCompleted: boolean;
}

interface UseUpdateTaskFormReturn {
  formData: TaskFormData;
  errors: Partial<Record<keyof TaskFormData, string>>;
  isLoading: boolean;
  isFormValid: boolean;
  handleInputChange: (field: keyof TaskFormData, value: string | number | boolean) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  priority: 1,
  dueDate: '',
  isCompleted: false,
};

export const useUpdateTaskForm = (): UseUpdateTaskFormReturn => {
  const { toast } = useToast();
  const router = useRouter();  // Initialize useRouter
  const queryClient = useQueryClient();  // Initialize useQueryClient
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      !!formData.title.trim() &&
      !!formData.description.trim() &&
      formData.priority > 0 &&
      !!formData.dueDate;
    if (isFormValid !== isValid) {
      setIsFormValid(isValid);
    }
  }, [formData, isFormValid]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TaskFormData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      return JSON.stringify(newData) !== JSON.stringify(prev) ? newData : prev;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
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

      // Optimistically update the task list
      queryClient.setQueryData(['toDoItems'], (old: any) => old.map((task: any) => 
        task.id === taskId ? { ...task, ...formData } : task
      ));

      await AxiosInstance.put(`/api/toDo/update?id=${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });  // Invalidate the query to refetch

      toast({ description: 'Task updated successfully 🎉' });
      router.push('/dashboard');  // Navigate to /dashboard
    } catch (error) {
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
    handleSubmit,
    resetForm,
  };
};