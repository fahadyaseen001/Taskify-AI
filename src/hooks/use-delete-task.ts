"use-client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "@/lib/axios-instance";
import { toast } from "@/hooks/use-toast";
import { ToDoItem } from "@/components/dashboard/dashboard-components/columns";

const deleteToDoItem = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authorization token not found in localStorage");

  const response = await AxiosInstance.delete(`/api/toDo/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { id },
  });

  if (response.status !== 200) {
    throw new Error("Failed to delete the task");
  }
  return response.data;
};

export const useDeleteToDoItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteToDoItem,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["toDoItems"] });

      const previousToDoItems = queryClient.getQueryData<ToDoItem[]>(["toDoItems"]);

      queryClient.setQueryData(["toDoItems"], (old: ToDoItem[] | undefined) => old?.filter(item => item.id !== id));

      return { previousToDoItems };
    },
    onError: (error, id, context) => {
      if (context) {
        queryClient.setQueryData(["toDoItems"], context.previousToDoItems);
      }
      
      let errorMessage = "Failed to delete the task 👎";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
    },
    onSuccess: () => {
      toast({
        description: "Task deleted successfully! 🎉",
        variant: "default",
      });
    }
  });
};
