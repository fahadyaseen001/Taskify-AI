"use-client"

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { userSchema } from "@/schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/form-input";
import { useSignIn } from "@/hooks/use-signin"; // Import the custom hook
import { z } from "zod";
import { useRouter } from 'next/navigation'; 

type SignInFormData = Pick<z.infer<typeof userSchema>, 'email' | 'password'>;

const signInSchema = userSchema.pick({ email: true, password: true });

export default function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false); 
  const router = useRouter(); 

  const { signIn } = useSignIn(); 

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    trigger
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data: SignInFormData) => {
    setLoading(true); // Set loading to true
    try {
      await signIn(data); // Call the signIn function from the custom hook
      router.push('/dashboard'); // Navigate to /dashboard
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  });

  const email = watch("email");
  const password = watch("password");

  const isFormValid = React.useMemo(() => {
    if (!email || !password) return false;
    if (Object.keys(errors).length > 0) return false;
    if (!isDirty) return false;

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasLetter && hasNumber && hasSpecial && isLongEnough;
  }, [email, password, errors, isDirty]);

  React.useEffect(() => {
    if (email || password) {
      trigger();
    }
  }, [email, password, trigger]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Enter your email and password to access your account.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            register={register("email")}
            error={errors.email}
            value={email || ""}
            showPassword={false}
          />
          <FormInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            register={register("password")}
            error={errors.password}
            value={password || ""}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />

        </CardContent>
        <CardFooter>
          
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={!isFormValid}
          >
            {loading ? (
              <>
                <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500 dark:text-black-500" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </>
            ) : (
              "Log In"
            )}
            
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}