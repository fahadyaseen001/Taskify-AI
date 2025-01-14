import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table } from "@tanstack/react-table";
import { getUserInfo } from "../dashboard-utils/assignee-info";
import { UserIcon } from "lucide-react";

interface MeModeProps<TData> {
  table: Table<TData>;
}

export function MeMode<TData>({ table }: MeModeProps<TData>) {
  const [meMode, setMeMode] = React.useState(false);

  // Handle filter changes in an effect
  React.useEffect(() => {
    const user = getUserInfo();
    
    if (meMode && user?.userId) {
      table.getColumn("assignee")?.setFilterValue(user.userId);
    } else {
      table.getColumn("assignee")?.setFilterValue(undefined);
    }
  }, [meMode, table]);

  const toggleMeMode = React.useCallback(() => {
    setMeMode(prev => !prev);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={meMode ? "default" : "outline"}
            size="icon"
            className="flex items-center space-x-2 h-9 w-auto px-4 rounded-full"
            onClick={toggleMeMode}
          >
            <UserIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {meMode ? "Me Mode On" : "Me Mode Off"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{meMode ? "Show all tasks" : "Show my tasks"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}