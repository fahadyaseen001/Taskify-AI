"use-client";

import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { z } from "zod";
import { userSchema } from "@/schema/user-schema";
import AxiosInstance from "@/lib/axios-instance";
import { useUser } from "@/components/tanstack-query/user-provider";

interface ErrorResponse {
  error: string;
}

type SignUpFormData = z.infer<typeof userSchema>;

interface SignUpResponse {
  message: string;
}

export const useSignUp = () => {
  const { toast } = useToast();
  const { setUser } = useUser();

  const signUp = async (data: SignUpFormData) => {
    try {
      // Make the API call
      await AxiosInstance.post<SignUpResponse>('/api/auth/signup', {
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      // Set user data in context
      if (data.name && data.email) {
        setUser({ name: data.name, email: data.email });
      } else {
        throw new Error("Name or email is null");
      }

      toast({
        title: "Account Created Successfully 🎉",
        description: "You have successfully created your account."
      });
    } catch (error) {
      let errorMessage = "An error occurred during sign up";
      
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ErrorResponse;
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }
        
      toast({
        title: "Sign Up Failed 👎",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return { signUp };
};
