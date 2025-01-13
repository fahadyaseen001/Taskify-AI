import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { userSchema } from "@/schema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/ui/form-input";
import { z } from "zod";
import { useSignUp } from "@/hooks/use-signup";
import Loader from "../pages/loader";

type SignUpFormData = z.infer<typeof userSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false); // Loading state
  const { signUp } = useSignUp(); // Use the custom hook

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    trigger
  } = useForm<SignUpFormData>({
    resolver: zodResolver(userSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = handleSubmit(async (data: SignUpFormData) => {
    setLoading(true); // Set loading to true
    await signUp(data); // Call the signUp function from the custom hook
    setLoading(false); // Set loading to false after the API call
  });

  const name = watch("name");
  const email = watch("email");
  const password = watch("password");

  const isFormValid = React.useMemo(() => {
    if (!name || !email || !password) return false;
    if (Object.keys(errors).length > 0) return false;
    if (!isDirty) return false;

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const isLongEnough = password.length >= 8;
    const isNameValid = name.length >= 3;

    return hasLetter && hasNumber && hasSpecial && isLongEnough && isNameValid;
  }, [name, email, password, errors, isDirty]);

  React.useEffect(() => {
    if (name || email || password) {
      trigger();
    }
  }, [name, email, password, trigger]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account by entering your name, email, and password.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <FormInput
            id="name"
            label="Name"
            type=" text"
            placeholder="Enter your name"
            register={register("name")}
            error={errors.name}
            value={name || ""}
            showPassword={false}
          />
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
            disabled={!isFormValid || loading} // Disable if loading
          >
            {loading ? (
              <>
                <Loader /> 
                Verifying Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}