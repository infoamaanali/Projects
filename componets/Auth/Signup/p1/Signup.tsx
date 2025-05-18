/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";

// Define types for form input states
interface SignupFormState {
  email: string;
  userName: string;
  password: string;
  showPassword: boolean;
}

// Define types for password validation states
interface PasswordValidationState {
  fullChar: boolean;
  upperChar: boolean;
  lowerChar: boolean;
  specialChar: boolean;
  numberChar: boolean;
}

const Signup: React.FC = () => {
  // Form states
  const [formState, setFormState] = useState<SignupFormState>({
    email: "",
    userName: "",
    password: "",
    showPassword: false,
  });

  // Password requirement states
  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidationState>({
      fullChar: false,
      upperChar: false,
      lowerChar: false,
      specialChar: false,
      numberChar: false,
    });

  // Submit states
  const [loading, setLoading] = useState<boolean>(false);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      email: e.target.value,
    }));
  };

  const handleChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState) => ({
      ...prevState,
      userName: e.target.value,
    }));
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormState((prevState) => ({
      ...prevState,
      password: value,
    }));

    validatePassword(value);
  };

  const toggleShowPassword = () => {
    setFormState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const emailClassNames = (): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formState.email.length === 0) return "border-gray-300";
    return emailRegex.test(formState.email)
      ? "border-green-500"
      : "border-red-500";
  };

  const isEmailValid = (): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);

  const validatePassword = (value: string): void => {
    setPasswordValidation({
      fullChar: value.length >= 8,
      upperChar: /[A-Z]/.test(value),
      lowerChar: /[a-z]/.test(value),
      specialChar: /[^A-Za-z0-9]/.test(value),
      numberChar: /[0-9]/.test(value),
    });
  };

  const isPasswordValid = (): boolean =>
    passwordValidation.fullChar &&
    passwordValidation.upperChar &&
    passwordValidation.lowerChar &&
    passwordValidation.specialChar &&
    passwordValidation.numberChar;

  const isFormValid = (): boolean =>
    isEmailValid() && formState.userName.trim() !== "" && isPasswordValid();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_LINK}/signup`,
        {
          email: formState.email,
          username: formState.userName,
          password: formState.password,
        }
      );

      toast("Signup successful!");

      // Reset form
      setFormState({
        email: "",
        userName: "",
        password: "",
        showPassword: false,
      });
      setPasswordValidation({
        fullChar: false,
        upperChar: false,
        lowerChar: false,
        specialChar: false,
        numberChar: false,
      });
    } catch (error) {
      toast(
        "Signup Failed, if this issue persists then please contact website owner!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen justify-center">
      <Toaster />
      {/* Left - Form */}
      <div className="md:w-1/2 w-full px-8 md:px-20 py-10 flex flex-col justify-center bg-white">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Welcome to Design Community
        </h1>
        <p className="text-sm text-gray-700 mb-6">
          Already have an account?{" "}
          <span className="text-black underline cursor-pointer">Log in</span>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChangeEmail}
              className={`w-full border rounded-md px-4 py-2 focus:ring-1 outline-none ${emailClassNames()}`}
              placeholder="Enter your email"
            />
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={formState.userName}
              onChange={handleChangeUserName}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Choose a username"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={formState.showPassword ? "text" : "password"}
                required
                minLength={8}
                value={formState.password}
                onChange={handleChangePassword}
                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-16 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-black"
              >
                {formState.showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <ul className="text-xs text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1 mt-2 pl-1">
            <li
              className={`${passwordValidation.fullChar ? "text-green-500" : ""}`}
            >
              • Use 8 or more characters
            </li>
            <li
              className={`${passwordValidation.upperChar ? "text-green-500" : ""}`}
            >
              • One Uppercase character
            </li>
            <li
              className={`${passwordValidation.lowerChar ? "text-green-500" : ""}`}
            >
              • One lowercase character
            </li>
            <li
              className={`${
                passwordValidation.specialChar ? "text-green-500" : ""
              }`}
            >
              • One special character
            </li>
            <li
              className={`${
                passwordValidation.numberChar ? "text-green-500" : ""
              }`}
            >
              • One number
            </li>
          </ul>

          {/* Checkbox */}
          <div className="flex items-start gap-2 mt-4">
            <input
              type="checkbox"
              id="promotions"
              defaultChecked
              className="mt-1 accent-black"
            />
            <label
              htmlFor="promotions"
              className="text-sm text-gray-700"
            >
              I want to receive emails about the product, feature updates,
              events, and marketing promotions.
            </label>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-600 mt-4">
            By creating an account, you agree to the{" "}
            <span className="underline cursor-pointer">Terms of use</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full text-white font-semibold py-2 rounded-md mt-6 transition ${
              isFormValid()
                ? "bg-black hover:bg-gray-900"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid() || loading}
          >
            {loading ? "Creating..." : "Create an account"}
          </button>

          <p className="text-sm text-gray-700 text-center mt-4">
            Already have an account?{" "}
            <span className="text-black underline cursor-pointer">Log in</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
