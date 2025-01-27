// use-ai-command.ts
'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import AxiosInstance from "@/lib/axios-instance";
import { useToast } from "@/hooks/use-toast";
import { ToDoType } from "@/models/todoList";

// Updated response types to match AIAgent service
interface AICommandResponse {
  success: boolean;
  task?: ToDoType;
  tasks?: ToDoType[];
  message?: string;
}

interface AICommandRequest {
  command: string;
}

const executeAICommand = async (command: string): Promise<AICommandResponse> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authorization token not found in localStorage");

  const response = await AxiosInstance.post<AICommandResponse>(
    "/api/ai/process-command",
    { command } as AICommandRequest,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useAICommand = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation<AICommandResponse, AxiosError<{ message: string }>, string>({
    mutationFn: executeAICommand,
    onSuccess: (data) => {
      // Invalidate and refetch tasks after successful command execution
      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
      
      // Customize success message based on the response
      let successMessage = "Command executed successfully 🎉";
      if (data.task) {
        successMessage = "Task updated successfully 🎉";
      } else if (data.tasks) {
        successMessage = `Found ${data.tasks.length} tasks 🎉`;
      } else if (data.message) {
        successMessage = data.message;
      }
      
      toast({
        description: successMessage,
      });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        description: `Failed to execute command: ${errorMessage} 👎`,
        variant: "destructive",
      });
    },
  });

  return {
    executeCommand: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
};