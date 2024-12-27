"use client";

import Link from "next/link";
import { columns } from "@/components/dashboard/columns";
import { MdAddCircleOutline } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { useFetchToDoItems } from "@/hooks/use-read-task";
import { UserNav } from "@/components/dashboard/user-nav";
import { DataTable } from "@/components/dashboard/data-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function TodoPage() {
  const { data: tasks, error, isLoading } = useFetchToDoItems();

  if (isLoading) {
    return (
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <UserNav />
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Loading...</h2>
            <Skeleton className="h-4 w-1/2 mt-2" />
            <Skeleton className="h-4 w-1/3 mt-2" />
          </div>
          <Skeleton className="h-8 w-32 ml-auto" />
        </div>
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error.message}</div>;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <UserNav />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&rsquo;s a list of your tasks for this month!
          </p>
        </div>
        <Link href="/task" passHref prefetch>
          <Button
            variant="default"
            size="default"
            className="ml-auto flex items-center"
          >
            <MdAddCircleOutline className="mr-2" />
            Add New Task
          </Button>
        </Link>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  );
}
