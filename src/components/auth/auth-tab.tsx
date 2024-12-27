'use client'
import * as React from "react"
import { FcTodoList } from "react-icons/fc"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignUpForm from "@/components/forms/signup-form"
import SignInForm from "../forms/signin-form"

export default function AuthTabs() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold ">Todo App</h1>
        <FcTodoList className="text-4xl " />
      </div>
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
        </Tabs>
    </div>
    )
}

        