import { z } from "zod";
import allowedEmailDomains from "@/utils/mail/allowedEmailDomains.json"; 

// Define Zod schema for validation
export const userSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .nullable(),
  email: z
    .string()
    .email("Invalid email")
    .nonempty("Email is required")
    .refine(
      (email) => {
        const emailDomain = email.split("@")[1];
        return allowedEmailDomains.includes(emailDomain);
      },
      { message: "Invalid email domain. Please use a valid email provider." }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain one number, one letter, and one special character"
    )
    .nonempty("Password is required"),
});
