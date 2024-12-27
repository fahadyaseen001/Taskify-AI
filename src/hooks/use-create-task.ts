import { useState, useEffect } from 'react';
import AxiosInstance from '@/lib/axios-instance';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";  // Import useQueryClient

interface TodoFormData {
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  priority: number | undefined;
}

interface ErrorResponse {
  error: string;
}

interface UseTodoFormReturn {
  formData: TodoFormData;
  errors: Partial<Record<keyof TodoFormData, string>>;
  isLoading: boolean;
  isFormValid: boolean;
  handleInputChange: (field: keyof TodoFormData, value: string | boolean | number | undefined) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const initialFormData: TodoFormData = {
  title: '',
  description: '',
  isCompleted: false,
  dueDate: new Date(),
  priority: undefined,
};

export const useTodoForm = (): UseTodoFormReturn => {
  const { toast } = useToast();
  const router = useRouter();  // Initialize useRouter
  const queryClient = useQueryClient();  // Initialize useQueryClient
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TodoFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof TodoFormData, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TodoFormData, string>> = {};
    if (!formData.title?.trim()) newErrors.title = 'Required';
    if (!formData.description?.trim()) newErrors.description = 'Required';
    if (!formData.dueDate) newErrors.dueDate = 'Required';
    if (!formData.priority) newErrors.priority = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = Boolean(
      formData.title?.trim() &&
      formData.description?.trim() &&
      formData.dueDate &&
      formData.priority
    );
    setIsFormValid(isValid);
  }, [formData]);

  const handleInputChange = (field: keyof TodoFormData, value: string | boolean | number | undefined) => {
    if (field === 'isCompleted') {
      const booleanValue = value === true;
      setFormData(prev => ({
        ...prev,
        [field]: booleanValue
      }));
      return;
    }
  
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const optimisticTask = { ...formData, id: Math.random().toString() }; // Create an optimistic task with a temporary ID
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token not found");

      // Optimistically update the task list
      queryClient.setQueryData(['toDoItems'], (old: TodoFormData[] | undefined) => [...(old || []), optimisticTask]);

      await AxiosInstance.post('/api/toDo/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });  // Invalidate the query to refetch

      toast({
        description: "Task created successfully 🎉 ",
      });

      resetForm();
      router.push('/dashboard');  // Navigate to /dashboard
    } catch (error) {
      let errorMessage = "Failed to create task 👎";
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ErrorResponse;
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }
      toast({
        description: errorMessage,
        variant: "destructive",
      });
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
