import * as React from "react"
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;  
  error?: { message: string };
  value: string;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

export default function FormInput({ id, label, type, placeholder, register, error, value, showPassword, togglePasswordVisibility }: FormInputProps) {
  return (
    <div className="space-y-1 relative">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-md p-2">
        {id === "email" ? (
          <FiMail className="text-gray-500 dark:text-gray-400 mr-2" />
        ) : id === "password" ? (
          <FiLock className="text-gray-500 dark:text-gray-400 mr-2" />
        ) : (
          <FiUser className="text-gray-500 dark:text-gray-400 mr-2" />
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          {...register}
          className="border-none focus:ring-0 focus:outline-none"
        />
        {id === "password" && (
          <button type="button" onClick={togglePasswordVisibility} className="ml-2 text-gray-500 dark:text-gray-400">
            {showPassword ? <FiEye /> : <FiEyeOff />}
          </button>
        )}
      </div>
      {error && value && <span className="text-red-500 text-xs">{String(error.message)}</span>}
      {!error && value && <span className="text-green-500 text-xs">Valid {label.toLowerCase()}</span>}
    </div>
  )
}
