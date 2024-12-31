'use client'

import * as React from "react";
import { columns } from "@/components/dashboard/dashboard-components/columns";
import { MdAddCircleOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useFetchToDoItems } from "@/hooks/use-read-task";
import { UserNav } from "@/components/dashboard/dashboard-components/user-nav";
import { DataTable } from "@/components/dashboard/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from 'next/navigation'; // Import useRouter hook
import Loader from "@/components/pages/loader";

export default function TodoPage() {
  const { data: tasks, error, isLoading } = useFetchToDoItems();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false); // State to manage navigation loading

  if (isLoading) {
    return (
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <UserNav isLoading={true} />
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Skeleton className="h-4 w-1/2 mt-2" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </div>
          <Skeleton className="h-8 w-32 ml-auto" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error.message}</div>;
  }

  const handleNavigation = () => {
    setIsNavigating(true);
    router.push('/task');
  };

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <UserNav isLoading={false}/>
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&rsquo;s a list of your tasks for this month!
          </p>
        </div>
        <Button
          variant="default"
          size="default"
          className="ml-auto flex items-center"
          onClick={handleNavigation}
          disabled={isNavigating}
        >
          {isNavigating ? <Loader /> : <MdAddCircleOutline className="mr-2" />}
          {isNavigating ? 'Add New Task...' : 'Add New Task'}
        </Button>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
