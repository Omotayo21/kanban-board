'use client';

import React, { useState, useEffect, ChangeEvent } from "react";
import Link from 'next/link';
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/hook";
import logodark from "../assets/logo-dark.svg";
import logolight from "../assets/logo-light.svg";
import Image from "next/image";

const ForgotPasswordReset: React.FC = () => {
  const { darkMode } = useAppSelector((state: any) => state.ui);
  const router = useRouter();
  const [email, setMail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/forgotpassword', { email });
      toast.success('A password reset link has been sent to your mail');
      router.push('/login');
      console.log(response.data);
    } catch (error: any) {
      toast.error(error.response?.data || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center mt-20">
      <form onSubmit={submit} className="flex flex-col items-center justify-center gap-y-8 lg:w-[40rem] sm:w-[22rem] sm:h-[28rem] lg:h-[30rem] bg-white border border-black">
        <Image
          src={darkMode ? logolight : logodark}
          alt="Logo"
          className="w-[200px] ml-5 mt-5 sm:hidden md:flex"
        />
        {loading ? (
          <p className="text-green-700 font-semibold">Processing, please wait...</p>
        ) : (
          <>
            <h2 className="font-semibold text-3xl">Forgot Password</h2>
            <p>Enter your Email address</p>
            <input
              type="email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMail(e.target.value)}
              placeholder="Enter your email"
              className="pl-2 lg:w-96 sm:w-72 rounded-md lg:h-12 sm:h-8 border border-black hover:border-green-600"
              required
            />
            <button
              type="submit"
              className="bg-indigo-500 text-white h-8 lg:w-64 sm:w-48 font-medium rounded-lg"
            >
              Submit
            </button>
            <p>
              Back to{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordReset;
