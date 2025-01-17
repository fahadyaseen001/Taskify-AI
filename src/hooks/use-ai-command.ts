'use client'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import AxiosInstance from "@/lib/axios-instance";
import { useToast } from "@/hooks/use-toast";

// API Response Type
interface AICommandResponse {
  success: boolean;
  message: string;
  result: {
    action: string;
    data: any;
    status: string;
  };
}

// Command Request Type
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
      
      toast({
        description: data.message || "Command executed successfully 🎉",
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