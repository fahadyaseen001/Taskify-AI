"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";
import { TbCancel } from "react-icons/tb";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";


import { DataTableColumnHeader } from "./table-column-header";
import ActionCell from "./action-cell";

export interface ToDoItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate: Date;
  priority: number;
}

const getPriorityInfo = (priority: number) => {
  if (priority >= 1 && priority <= 3) {
    return {
      label: "High",
      color: "text-red-600",
      icon: ArrowUp,
    };
  } else if (priority >= 4 && priority <= 7) {
    return {
      label: "Medium",
      color: "text-yellow-600",
      icon: ArrowRight,
    };
  } else {
    return {
      label: "Low",
      color: "text-green-600",
      icon: ArrowDown,
    };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

export const columns: ColumnDef<ToDoItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task ID" />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "isCompleted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isCompleted = row.getValue("isCompleted") as boolean;
      return (
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <IoMdCheckmarkCircleOutline size={16} />
          ) : (
            <TbCancel size={16} />
          )}
          <Label
            className={`capitalize ${
              isCompleted ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCompleted ? "Completed" : "Incomplete"}
          </Label>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      return formatDate(date);
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as number;
      const { label, color, icon: Icon } = getPriorityInfo(priority);

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span className={color}>{label}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell taskId={row.original.id} taskData={row.original} />,
  },
];
