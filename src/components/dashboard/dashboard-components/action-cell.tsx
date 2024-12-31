'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useDeleteToDoItem } from "@/hooks/use-delete-task";
import { useQueryClient } from "@tanstack/react-query";
import { ToDoItem } from "./columns";
import Loader from "@/components/pages/loader";

interface ActionCellProps {
  taskId: string;
  taskData: ToDoItem;
}

const ActionCell: React.FC<ActionCellProps> = ({ taskId, taskData }) => {
  const queryClient = useQueryClient();
  const { mutate, status } = useDeleteToDoItem();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const router = useRouter();

  const shouldKeepOpen = status === "pending" || loadingEdit;

  const handleDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["toDoItems"] });
        setMenuOpen(false);
        toast({
          description: "Task deleted successfully! 🗑️",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleEditClick = async () => {
    setLoadingEdit(true);
    try {
      sessionStorage.setItem(`task-${taskId}`, JSON.stringify(taskData));
      await router.push(`/dashboard/${taskId}`);
    } catch {
      toast({
        description: "Failed to navigate to edit page. Please try again.",
        variant: "destructive",
      });
      setLoadingEdit(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(taskId);
    toast({
      description: "Task ID copied to clipboard! 🎉",
      variant: "default",
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && shouldKeepOpen) {
      return;
    }
    setMenuOpen(open);
  };

  return (
    <DropdownMenu 
      open={menuOpen || shouldKeepOpen} 
      onOpenChange={handleOpenChange}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={handleCopyId}
          className="cursor-pointer"
        >
          Copy task ID
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleEditClick} 
          disabled={loadingEdit}
          className="cursor-pointer"
        >
          {loadingEdit ? (
            <div className="flex items-center gap-2">
              <Loader />
              <span>Edit task...</span>
            </div>
          ) : (
            "Edit task"
          )}
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleDelete(taskId)}
          disabled={status === "pending"}
          className="text-red-600 cursor-pointer"
        >
          {status === "pending" ? (
            <div className="flex items-center gap-2">
              <Loader />
              <span>Deleting task...</span>
            </div>
          ) : (
            "Delete task"
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionCell;