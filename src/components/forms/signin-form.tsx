'use client'

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { userSchema } from "@/schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/form-input";
import { useSignIn } from "@/hooks/use-signin"; 
import { z } from "zod";
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import Loader from "../pages/loader";

type SignInFormData = Pick<z.infer<typeof userSchema>, 'email' | 'password'>;

const signInSchema = userSchema.pick({ email: true, password: true });

export default function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false); 
  const router = useRouter(); // Use useRouter from next/navigation

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
    setLoading(true);
    const isSuccess = await signIn(data);
    if (isSuccess) {
      router.push('/dashboard'); 
    } else {
      setLoading(false);
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
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <>
                <Loader /> 
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
