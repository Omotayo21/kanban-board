'use client';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAppSelector } from '../redux/hook';
import logodark from '../assets/logo-dark.svg';
import logolight from '../assets/logo-light.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface User {
  email: string;
  password: string;
  name: string;
}

interface Errors {
  email?: string;
  password?: string;
}

interface RootState {
  ui: {
    darkMode: boolean;
  };
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState<Errors>({
    email: "",
    password: "",
  });
  const { darkMode } = useAppSelector((state: RootState) => state.ui);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (): boolean => {
    if (!user.email.includes('@gmail.com') && !user.email.includes('@yahoo.com')) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Please enter a valid email address ending with @gmail.com or @yahoo.com',
      }));
      return false;
    }
    return true;
  };

  const validatePassword = (): boolean => {
    if (user.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Password must be at least 8 characters long',
      }));
      return false;
    }
    if (confirmPassword !== user.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: 'Passwords do not match',
      }));
      return false;
    }
    return true;
  };

  //tjis may not work because of we removed a typescript code, come back to it
  const SignupAction = async (e: FormEvent) => {
    e.preventDefault();
     setErrors({ email: "", password: "" })
    if (validateEmail() && validatePassword()) {
      try {
        setLoading(true);
        const response = await axios.post('/api/signup', user);
        router.push('/sucessful');
        toast.success('Signed Up successfully');
        console.log('signup success', response.data);
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user.email && user.password && user.name) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

 
  return (
    <div className={` min-h-screen flex flex-col justify-center items-center ${ darkMode ? "bg-gray-600" : "bg-gray-200" }`}>
      <div
        className={`  p-8 rounded-lg shadow-md gap-y-2 flex flex-col ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex flex-row justify-center items-center">
          <Image
            src={darkMode ? logolight : logodark}
            alt="logo"
            className="w-[170px] items-center mb-5"
          />{" "}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-start ">
            Join Rahman&apos;s Kanban!
          </h2>
          <p className="text-start text-gray-600 ">
            Create your account to start streamlining your workflow with our
            powerful Kanban application.
          </p>{" "}
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Enter your name here"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            value={user.name}
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`bg-gray-50 border ${
              errors.email ? "border-red-500" : "border-blue-300"
            } text-gray-900 sm:text-sm rounded-lg block w-full p-2.5`}
            required
            placeholder="Enter your email"
            value={user.email}
            name="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input with Toggle */}
        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            className={`bg-gray-50 border ${
              errors.password ? "border-red-500" : "border-blue-300"
            } text-gray-900 sm:text-sm rounded-lg block w-full p-2.5`}
            required
            placeholder="Enter your password"
            value={user.password}
            name="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          {/* Eye Icon */}
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

        {/* Confirm Password Input with Toggle */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300"
            placeholder="Please confirm your password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* Eye Icon for Confirm Password */}
          <div
            onClick={toggleConfirmPasswordVisibility}
            className="absolute right-3 top-10 cursor-pointer"
          >
            {confirmPasswordVisible ? (
              <FaEyeSlash size={16} />
            ) : (
              <FaEye size={16} />
            )}
          </div>
          <p className="text-sm font-light text-black-500">
            Already have an account ?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:underline "
            >
              Visit Login page
            </Link>
          </p>
        </div>

        {/* Create Account Button */}
        <button
          onClick={SignupAction}
          type="submit"
          disabled={buttonDisabled || loading}
          className={`w-full text-white bg-indigo-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center 
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
        {/* Divider */}
        
    
        {/* Login Link */}
      </div>
    </div>
  );
};

export default Signup;
