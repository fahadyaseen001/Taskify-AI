"use-client";

import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { z } from "zod";
import { userSchema } from "@/schema/user-schema";
import AxiosInstance from "@/lib/axios-instance";
import { useUser } from "@/components/providers/user-provider";

interface ErrorResponse {
  error: string;
}

interface SignUpResponse {
  message: string;
}

interface VerifyEmailResponse {
  message: string;
  name: string;
  email: string;
}

type SignUpFormData = z.infer<typeof userSchema>;

export const useSignUp = () => {
  const { toast } = useToast();
  const { setUser } = useUser();

  const signUp = async (data: SignUpFormData) => {
    try {
      // Call the signup API
      const response = await AxiosInstance.post<SignUpResponse>(
        "/api/auth/signup",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );

      // Inform user to verify their email
      toast({
        title: "Verify Email ✉️",
        description: response.data.message, // For example, "Check your email for verification."
      });
    } catch (error) {
      // Handle signup errors
      let errorMessage = "An error occurred during sign up.";
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ErrorResponse;
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }

      toast({
        title: "Account Creation Failed 👎",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // Call the verify email API
      const response = await AxiosInstance.get<VerifyEmailResponse>(
        `/api/auth/verify-email?token=${token}`
      );

      const { name, email } = response.data;
      // Update verified user in context
      setUser({ name, email });

      toast({
        title: "Account Created Successfully 🎉",
        description: "Your email has been verified, and your account is now active.",
      });
    } catch (error) {
      // Handle verification errors
      let errorMessage = "An error occurred during email verification.";
      if (error instanceof AxiosError) {
        const errorData = error.response?.data as ErrorResponse;
        if (errorData?.error) {
          errorMessage = errorData.error;
        }
      }

      toast({
        title: "Email Verification Failed 👎",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return { signUp, verifyEmail };
};
