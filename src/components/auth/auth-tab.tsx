'use client'

import * as React from "react"
import { SiTask } from "react-icons/si";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignUpForm from "@/components/forms/signup-form"
import SignInForm from "../forms/signin-form"
import { useSearchParams } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

export default function AuthTabs() {
  const searchParams = useSearchParams()
  const verified = searchParams ? searchParams.get('verified') : null
  const { toast } = useToast()
  
  const [queryVerified, setQueryVerified] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (verified !== null && verified !== queryVerified) {
      setQueryVerified(verified)
    }
  }, [verified, queryVerified])

  React.useEffect(() => {
    if (queryVerified) {
      if (queryVerified === 'true') {
        toast({
          title: "Account Created Successfully 🎉",
          description: "Your email has been verified. Please sign in to continue.",
        })
      } else if (queryVerified === 'false') {
        toast({
          title: "Verification Failed",
          description: "Failed to verify your email. Please try signing up again.",
          variant: "destructive"
        })
      }
      
      // Clean up URL after toast is shown
      setTimeout(() => {
        const newURL = window.location.pathname
        window.history.pushState({}, '', newURL)
      }, 100)
    }
  }, [queryVerified, toast])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold">UpTask</h1>
        <SiTask className="text-4xl" />
      </div>
      <Tabs defaultValue="signin" className="w-full max-w-[400px]">
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