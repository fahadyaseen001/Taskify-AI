import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

export const priorityStyles = {
  High: {
    label: "High",
    color: "text-red-600 dark:text-red-400",
    icon: ArrowUp,
  },
  Medium: {
    label: "Medium",
    color: "text-yellow-600 dark:text-yellow-400",
    icon: ArrowRight,
  },
  Low: {
    label: "Low",
    color: "text-green-600 dark:text-green-400",
    icon: ArrowDown,
  },
};

export const getPriorityInfo = (priority: keyof typeof priorityStyles) => {
  return priorityStyles[priority] || {
    label: "Unknown",
    color: "text-gray-600",
    icon: ArrowRight,
  };
};
