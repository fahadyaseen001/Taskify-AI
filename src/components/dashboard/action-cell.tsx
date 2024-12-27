"use client";

import { useState } from "react";
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDeleteToDoItem } from "@/hooks/use-delete-task";
import { useQueryClient } from "@tanstack/react-query";
import { ToDoItem } from "./columns";

interface ActionCellProps {
  taskId: string;
  taskData: ToDoItem;
}

const ActionCell: React.FC<ActionCellProps> = ({ taskId, taskData }) => {
  const queryClient = useQueryClient();
  const { mutate, status } = useDeleteToDoItem();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
        setMenuOpen(false);
      },
    });
  };

  const handleEditClick = () => {
    // Store task data in sessionStorage before navigation
    sessionStorage.setItem(`task-${taskId}`, JSON.stringify(taskData));
  };

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(taskId);
            toast({
              description: "Task ID copied to clipboard! 🎉",
              variant: "default",
            });
          }}
        >
          Copy task ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link href={`/dashboard/${taskId}`} passHref>
          <DropdownMenuItem onSelect={handleEditClick}>
            Edit task
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleDelete(taskId)}
          disabled={status === "pending"}
        >
          {status === "pending" ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-500 dark:text-black-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Delete task"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;