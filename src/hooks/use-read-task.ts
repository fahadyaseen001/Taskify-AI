"use-client";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import AxiosInstance from "@/lib/axios-instance";

// API Response Type (with MongoDB-style _id)
interface TodoApiResponse {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;  // Separate time field in API response
  priority: string;
}

// Frontend Todo Item Type (with id)
interface ToDoItem {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;  // Separate time field in frontend
  priority: string;
}

const fetchToDoItems = async (): Promise<ToDoItem[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Authorization token not found in localStorage");

  const response = await AxiosInstance.get<{ toDoItems: TodoApiResponse[] }>("/api/toDo/read", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.toDoItems.map((item) => ({
    id: item._id,
    title: item.title,
    description: item.description,
    status: item.status,
    dueDate: item.dueDate,
    dueTime: item.dueTime,  // Pass through the time field
    priority: item.priority,
  }));
};

export const useFetchToDoItems = () => {
  return useQuery<ToDoItem[], AxiosError>({
    queryKey: ["toDoItems"],
    queryFn: fetchToDoItems,
    staleTime: 5 * 60 * 1000, 

  });
};
