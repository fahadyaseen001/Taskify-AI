import { useState, useEffect } from 'react';
import AxiosInstance from '@/lib/axios-instance';
import { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useQueryClient } from "@tanstack/react-query";
import jwt from 'jsonwebtoken';

// Updated interfaces to match new schema
interface UserInfo {
  userId: string;
  name: string;
  email: string;
}

interface TodoFormData {
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  assignee: UserInfo;
}


interface UseTodoFormReturn {
  formData: TodoFormData;
  errors: Partial<Record<keyof Omit<TodoFormData, 'assignee'> | 'assignee', string>>;
  isLoading: boolean;
  isFormValid: boolean;
  handleInputChange: (field: keyof Omit<TodoFormData, 'assignee'>, value: string) => void;
  handleAssigneeChange: (assignee: UserInfo) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

// Get logged-in user info from token
const getLoggedInUserInfo = (): UserInfo | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt.decode(token) as { userId: string; name: string; email: string } | null;
    if (!decoded) return null;

    return {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email
    };
  } catch {
    return null;
  }
};

const initialFormData: TodoFormData = {
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

export const useTodoForm = (): UseTodoFormReturn => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TodoFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<TodoFormData, 'assignee'> | 'assignee', string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Omit<TodoFormData, 'assignee'> | 'assignee', string>> = {};
    
    // Validate regular fields
    if (!formData.title?.trim()) newErrors.title = 'Required Title';
    if (!formData.description?.trim()) newErrors.description = 'Required Description';
    if (!formData.dueDate) newErrors.dueDate = 'Required Due Date';
    if (!formData.dueTime) newErrors.dueTime = 'Required Due Time';
    if (!formData.priority) newErrors.priority = 'Required Priority';
    if (!formData.status) newErrors.status = 'Required Status';

    // Validate assignee
    if (!formData.assignee.userId || !formData.assignee.name || !formData.assignee.email) {
      newErrors.assignee = 'Required Assignee Information';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleInputChange = (field: keyof Omit<TodoFormData, 'assignee'>, value: string) => {
    if (field === 'dueDate' && value) {
      const date = new Date(value);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(date.getTime() - userTimezoneOffset);

      setFormData(prev => ({
        ...prev,
        [field]: adjustedDate.toISOString()
      }));
    } else if (field === 'dueTime' && value) {
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

  const handleAssigneeChange = (assignee: UserInfo) => {
    setFormData(prev => ({
      ...prev,
      assignee
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const creator = getLoggedInUserInfo();
    if (!creator) {
      toast({
        description: "User authentication error. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const payload = { ...formData, createdBy: creator };

    // Optimistic update
    const optimisticTask = { 
      ...payload, 
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    queryClient.setQueryData(['toDoItems'], (old: any[] | undefined) => 
      [...(old || []), optimisticTask]
    );

    try {
        setIsLoading(true);
        const response = await AxiosInstance.post('/api/toDo/create', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        console.log("Task created:", response.data);

        // Update queryClient based on the response
        queryClient.invalidateQueries({ queryKey: ["toDoItems"] });

        toast({
          description: "Task created successfully 🎉",
        });

        resetForm();
        router.push('/dashboard');
    } catch (error) {
        // Rollback optimistic update
        queryClient.setQueryData(['toDoItems'], (old: any[] | undefined) => 
          (old || []).filter(task => task.id !== optimisticTask.id)
        );

        let errorMessage = "Failed to create task 👎";
        if (error instanceof AxiosError) {
          
          errorMessage = error.response?.data?.error || error.message;
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
    handleAssigneeChange,
    handleSubmit,
    resetForm,
  };
};
