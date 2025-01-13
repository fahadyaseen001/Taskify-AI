'use client'

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import AxiosInstance from "@/lib/axios-instance";

// API Response Type
interface TodoApiResponse {
  _id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  assignee?: {
    name: string;
    email: string;
    userId: string;
  };
}

// Frontend Todo Item Type
interface ToDoItem {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  assignee?: {
    name: string;
    email: string;
    userId: string;
  };
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
    dueTime: item.dueTime,
    priority: item.priority,
    assignee: item.assignee,
  }));
};

export const useFetchToDoItems = () => {
  return useQuery<ToDoItem[], AxiosError>({
    queryKey: ["toDoItems"],
    queryFn: fetchToDoItems,
    staleTime: 5 * 60 * 1000,
  });
};
