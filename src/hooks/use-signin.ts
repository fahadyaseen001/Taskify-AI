'use client'

import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { z } from "zod";
import { userSchema } from "@/schema/user-schema";
import AxiosInstance from "@/lib/axios-instance";
import { useUser } from "@/components/providers/user-provider";



interface ErrorResponse {
  error: string;
}

type SignInFormData = Pick<z.infer<typeof userSchema>, 'email' | 'password'>;

interface SignInResponse {
  token: string;
}


export const useSignIn = () => {
  const { toast } = useToast();
  const { updateUserFromToken } = useUser();


  const signIn = async (data: SignInFormData): Promise<boolean> => {
    try {
      const response = await AxiosInstance.post<SignInResponse>('/api/auth/signin', {
        email: data.email,
        password: data.password
      });

      const token = response.data.token;

      localStorage.setItem('token', token);

        // Update user context immediately after setting token
        updateUserFromToken();

      toast({
        title: "Sign In Successful 🎉",
        description: "You have successfully signed in to your account."
      });

      return true; // Return true on successful sign in
    } catch (error) {
      let errorMessage = "An error occurred during sign in";

      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ErrorResponse;
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }

      toast({
        title: "Sign In Failed 👎",
        description: errorMessage,
        variant: "destructive"
      });

      return false; // Return false when sign in fails
    }
  };

  return { signIn };
};
