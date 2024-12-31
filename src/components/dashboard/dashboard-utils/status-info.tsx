import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { LuCircle, LuTimer, LuCircleHelp } from "react-icons/lu";
import { TbCancel } from "react-icons/tb";

export const statusStyles = {
  Completed: {
    icon: IoMdCheckmarkCircleOutline,
    color: "text-green-600 dark:text-green-400",
    label: "Completed",
  },
  Todo: {
    icon: LuCircle,
    color: "text-gray-600 dark:text-gray-400",
    label: "Todo",
  },
  "In Progress": {
    icon: LuTimer,
    color: "text-blue-600 dark:text-blue-400",
    label: "In Progress",
  },
  BackLog: {
    icon: LuCircleHelp,
    color: "text-yellow-600 dark:text-yellow-400",
    label: "BackLog",
  },
  Cancelled: {
    icon: TbCancel,
    color: "text-red-600 dark:text-red-400",
    label: "Cancelled",
  },
};



export const getStatusInfo = (status: keyof typeof statusStyles) => {
  return statusStyles[status] || {
    icon: TbCancel,
    color: "text-gray-600",
    label: status,
  };
};
