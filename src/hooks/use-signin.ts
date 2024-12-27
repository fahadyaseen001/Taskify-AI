// hooks/useSignIn.ts
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { z } from "zod";
import { userSchema } from "@/schema/user-schema";
import AxiosInstance from "@/lib/axios-instance";

interface ErrorResponse {
  error: string;
}

// Only include email and password for signin
type SignInFormData = Pick<z.infer<typeof userSchema>, 'email' | 'password'>;

interface SignInResponse {
  token: string;
}

export const useSignIn = () => {
  const { toast } = useToast();

  const signIn = async (data: SignInFormData) => {
    try {

      // Make the API call after the delay
      const response = await AxiosInstance.post<SignInResponse>('/api/auth/signin', {
        email: data.email,
        password: data.password
      });
      
      const token = response.data.token;
      localStorage.setItem('token', token);
      
      
      toast({
        title: "Sign In Successful 🎉",
        description: "You have successfully signed in to your account."
      });
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
    }
  };

  return { signIn };
};