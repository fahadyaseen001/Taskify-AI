import { useState, useEffect } from 'react';
import AxiosInstance from '@/lib/axios-instance';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";  // Import useQueryClient

interface TodoFormData {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;  // Separate time field
  priority: string ;
}

interface ErrorResponse {
  error: string;
}

interface UseTodoFormReturn {
  formData: TodoFormData;
  errors: Partial<Record<keyof TodoFormData, string>>;
  isLoading: boolean;
  isFormValid: boolean;
  handleInputChange: (field: keyof TodoFormData, value: string) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const initialFormData: TodoFormData = {
  title: '',
  description: '',
  status: '',
  dueDate: '',  // Changed from Date to string
  dueTime: '',  // Initialize empty time
  priority: '',
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
    if (!formData.title?.trim()) newErrors.title = 'Required Title';
    if (!formData.description?.trim()) newErrors.description = 'Required Description';
    if (!formData.dueDate) newErrors.dueDate = 'Required Due Date';
    if (!formData.dueTime) newErrors.dueTime = 'Required Due Time';  // Separate time validation
    if (!formData.priority) newErrors.priority = 'Required Priority';
    if (!formData.status) newErrors.status = 'Required Status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const isValid = Boolean(
      formData.title?.trim() &&
      formData.description?.trim() &&
      formData.dueDate &&
      formData.dueTime &&  // Include time in validation
      formData.priority?.trim() &&
      formData.status?.trim()
    );
    setIsFormValid(isValid);
  }, [formData]);

 // In use-create-task.ts
 const handleInputChange = (field: keyof TodoFormData, value: string) => {
  if (field === 'dueDate' && value) {
    // Get the date and adjust for timezone
    const date = new Date(value);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() - userTimezoneOffset);
    
    setFormData(prev => ({
      ...prev,
      [field]: adjustedDate.toISOString()
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
      [field]: formattedTime
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }
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
