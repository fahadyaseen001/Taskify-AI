"use client";

import TaskForm from "@/components/forms/task-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

export default function TaskPage() {

  return (
    <div
      className="relative h-screen"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
      <Link href="/dashboard" passHref prefetch>
        <Button
          variant="outline"
          size="icon"
       
        >
          <IoIosArrowBack className="h-[1.2rem] w-[1.2rem]" />
        </Button>
        </Link>
      </div>

      {/* Task Form */}
      <TaskForm />
    </div>
  );
}
