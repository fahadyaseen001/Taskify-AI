// options-data.tsx
import { useGetUsers } from "@/hooks/use-get-users";
import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, CircleOff, HelpCircle, Timer } from "lucide-react";


export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];

// Function to prepare assignee options dynamically
export const usePrepareAssigneeOptions = (): { options: { value: string; label: string }[]; isLoading: boolean; isError: boolean } => {
  const { data: users, isLoading, isError } = useGetUsers();
  
  const options = users
    ? users.map((user) => ({
        value: user._id,
        label: user.name,
      }))
    : [];
  
  return { options, isLoading, isError };
};
