import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { DataTableColumnHeader } from "./table-column-header";
import ActionCell from "./action-cell";
import { getStatusInfo, statusStyles } from "../dashboard-utils/status-info";
import { getPriorityInfo, priorityStyles } from "../dashboard-utils/priority-info";
import { formatDate } from "../dashboard-utils/date-format";

export interface ToDoItem {
  id: string;
  _id?: string; // Add support for MongoDB _id
  title: string;
  description: string;
  status: "Todo" | "Completed" | "Cancelled" | "In Progress" | "BackLog";
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  dueTime: string;
  assignee?: {
    name: string;
    email: string;
    userId: string;
  };
}

const formatTaskId = (id: string | undefined) => {
  if (!id) return 'TASK-XXXX';
  
  // Handle MongoDB _id format (which is typically longer)
  if (id.length > 4) {
    return `TASK-${id.slice(-4)}`;
  }
  
  // Handle case where id is already in short format
  return `TASK-${id.padStart(4, '0')}`;
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
    cell: ({ row }) => {
      const id = (row.getValue("id") as string) || (row.original._id as string);
      return <span className="font-medium">{formatTaskId(id)}</span>;
    },
    
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="font-medium">{title}</span>;
    },
    size: 150,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <span className="font-medium">{description}</span>;
    },
    size: 250,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusStyles;
      const { icon: Icon, color, label } = getStatusInfo(status);

      return (
        <div className="flex items-center gap-2 font-medium ">
          <Icon size={16} />
          <Label className={`capitalize ${color}`}>{label}</Label>
        </div>
      );
    },
    enableColumnFilter: true,

  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string;
      return <span className="font-medium">{formatDate(date)}</span>;
    },
  },
  {
    accessorKey: "dueTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Time" />
    ),
    cell: ({ row }) => {
      const time = row.getValue("dueTime") as string; // Or adjust if it's in a different format
      return <span className="font-medium">{time}</span>; 
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.getValue("priority") as keyof typeof priorityStyles;
      const { label, color, icon: Icon } = getPriorityInfo(priority);

      return (
        <div className="flex items-center gap-2 font-medium">
          <Icon className="h-4 w-4" />
          <span className={color}>{label}</span>
        </div>
      );
    },
    enableColumnFilter: true,

  },
  {
    accessorKey: "assignee",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assignee" />
    ),
    cell: ({ row }) => {
      const assignee = row.getValue("assignee") as ToDoItem["assignee"];
      return (
        <div className="flex items-center font-medium">
            {assignee?.name || " - "}
            </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      if (!filterValue) return true;
      const assignee = row.getValue(id) as ToDoItem["assignee"];
      return assignee?.userId === filterValue;
    },
    enableColumnFilter: true,
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionCell taskId={row.original.id} taskData={row.original} />,
  },
];
