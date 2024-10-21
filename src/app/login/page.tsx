'use client'
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import { useAppSelector } from "../redux/hook";
import logodark from "../assets/logo-dark.svg";
import logolight from "../assets/logo-light.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
interface User {
  email: string;
  password: string;
 
}

interface Errors {
  email?: string;
  password?: string;
}

const Login = () => {
  const router = useRouter();
  const { darkMode } = useAppSelector((state : any) => state.ui);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState <boolean> (false);
  const [loading, setLoading] = useState <boolean>(false);
  const [notification, setNotification] = useState <any>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateEmail = () => {
    if (
      !user.email.includes("@gmail.com") &&
      !user.email.includes("@yahoo.com")
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email:
          "Please enter a valid email address ending with @gmail.com or @yahoo.com",
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    return true;
  };

  const validatePassword = () => {
    if (user.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters long",
      }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    return true;
  };

  const loginAction = async (e: any) => {
    e.preventDefault();
    if (validateEmail() && validatePassword()) {
      try {
        setLoading(true);
        const response = await axios.post("/api/login", user);
        router.push("/dashboard");
        toast.success("Login success");
        console.log("Login success", response.data);
      } catch (error : any) {
        toast.error(error.message);
        console.log(error);
        setNotification({
          type: "error",
          message: "Incorrect email or password",
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 7) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200">
      <div
        className={`p-8 rounded-lg shadow-md gap-y-2 flex flex-col ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex flex-row justify-center items-center">
          <Image
            src={darkMode ? logolight : logodark}
            alt="logo"
            className="w-[170px] items-center mb-5"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-start">Welcome Back!</h2>
          <p className="text-start text-gray-600 mb-6">
            Log in to your account to continue managing your projects and tasks
            seamlessly.
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            name="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="name@mail.com"
            className={`bg-gray-50 border ${
              errors.email ? "border-red-500" : "border-blue-300"
            } text-gray-900 sm:text-sm rounded-lg block w-full p-2.5`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input with Toggle */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            value={user.password}
            type={passwordVisible ? "text" : "password"}
            name="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="at least 8 characters long"
            className={`bg-gray-50 border ${
              errors.password ? "border-red-500" : "border-blue-300"
            } text-gray-900 sm:text-sm rounded-lg block w-full p-2.5`}
            required
          />
          <div
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-10 cursor-pointer"
          >
            {passwordVisible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start"></div>
          <Link
            href="/forgotpassword"
            className="text-sm font-medium text-indigo-600 hover:underline "
          >
            Forgot password?
          </Link>
        </div>
        <p className="text-sm font-light text-black-500">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 hover:underline "
          >
            Sign up
          </Link>
        </p>

        {notification && (
          <div className="text-red-700 flex flex-row items-center justify-center">
            <p>{notification.message}</p>
          </div>
        )}
        <button
          onClick={loginAction}
          type="submit"
          className={`w-full text-white bg-indigo-500 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
            buttonDisabled ? "bg-green-300 cursor-not-allowed" : "bg-green-600"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Authenticating..." : "Sign in"}
        </button>
         {/* Divider */}
        <div className="my-4 flex flex-col items-center gap-y-2">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-400">OR</span>
          <hr className="flex-grow border-gray-300" />
          <button className="w-64 flex items-center justify-center border border-gray-500 py-2 rounded-lg hover:bg-gray-100 transition duration-200">
            <img
              src="https://img.icons8.com/color/48/000000/google-logo.png"
              alt="Google Logo"
              className="w-5 h-5 mr-3"
              width={20} 
              height={20} 
            />
            Continue with Google
          </button>
        </div>
      </div>
      </div>
    
  );
};

export default Login;
