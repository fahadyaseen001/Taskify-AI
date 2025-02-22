'use client'

import TaskDetailForm from "@/components/forms/task-detail-form";
import AuthProvider from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";

export default function TaskDetailPage() {
  return (
    <AuthProvider>
    <div className="flex flex-col h-screen p-4 md:p-8">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <Link href="/dashboard" passHref prefetch>
          <Button variant="outline" size="icon">
            <IoIosArrowBack className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </Link>
      </div>

      {/* Centered Task Detail Form */}
      <div className="flex flex-1 items-center justify-center">
        <TaskDetailForm />
      </div>
    </div>
    </AuthProvider>
    
  );
}

