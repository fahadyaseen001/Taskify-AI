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
  
  // Use useRef instead of state to avoid unnecessary rerenders
  const verifiedRef = React.useRef<string | null>(null)

  // Debounced toast handler
  const debouncedToast = React.useCallback(
    React.useMemo(
      () =>
        debounce((message: { title: string; description: string; variant?: "destructive" }) => {
          toast(message)
        }, 100),
      [toast]
    ),
    []
  )

  // Memoize the verification check
  const handleVerification = React.useCallback(() => {
    if (verified !== null && verified !== verifiedRef.current) {
      verifiedRef.current = verified
      
      if (verified === 'true') {
        debouncedToast({
          title: "Account Created Successfully 🎉",
          description: "Your email has been verified. Please sign in to continue.",
        })
      } else if (verified === 'false') {
        debouncedToast({
          title: "Verification Failed",
          description: "Failed to verify your email. Please try signing up again.",
          variant: "destructive"
        })
      }
      
      // Use requestAnimationFrame for smoother URL updates
      requestAnimationFrame(() => {
        const newURL = window.location.pathname
        window.history.pushState({}, '', newURL)
      })
    }
  }, [verified, debouncedToast])

  // Use layout effect to prioritize verification check
  React.useLayoutEffect(() => {
    handleVerification()
  }, [handleVerification])

  // Memoize the components to prevent unnecessary rerenders
  const memoizedSignInForm = React.useMemo(() => <SignInForm />, [])
  const memoizedSignUpForm = React.useMemo(() => <SignUpForm />, [])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold">Taskify AI</h1>
        <SiTask className="text-4xl" />
      </div>
      <Tabs defaultValue="signin" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          {memoizedSignInForm}
        </TabsContent>
        <TabsContent value="signup">
          {memoizedSignUpForm}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}