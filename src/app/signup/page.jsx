'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import {CaretLeft} from 'phosphor-react';
import Pen from '../../../public/shared/icon-new-feedback.svg'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import { toast } from 'react-toastify';
import axios from 'axios';

const Signup = () => {
    
      const router = useRouter();
      const [user, setUser] = useState({
        name: "",
        password: "",
        username: "",
      });
      const [errors, setErrors] = useState({
        username: "",
        password: "",
      });
      const [loading, setLoading] = useState(false);
      const [buttonDisabled, setButtonDisabled] = useState(false);

      const validateUsername = () => {
        if (
         user.username.length < 3
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email:
              "USername must be more than 3 characters",
          }));
          return false;
        }
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
        return true;
      };

      const signupAction = async (e) => {
        e.preventDefault();
        if (validateUsername() && validatePassword()) {
          try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            router.push("/login");
            toast.success("Signed Up successfully");
            console.log("signup success", response.data);
          } catch (error) {
            toast.error(error.message);
            console.log(error);
          }
        } else {
          setLoading(false);
        }
      };
      useEffect(() => {
        if (
          user.name.length > 0 &&
          user.password.length > 0 &&
          user.username.length > 0
        ) {
          setButtonDisabled(false);
        } else {
          setButtonDisabled(true);
        }
      }, [user]); 
   
  return (
    <div>
      <section className="bg-gray-200 sm:h-[50rem] md:h-full ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto sm:max-w-md md:h-screen lg:py-0">
          <p className="text-black flex flex-row text-sm gap-x-1 -ml-72 mb-8 font-semibold">
            {" "}
            <CaretLeft size={16} className="mt-1" /> <span>Go back</span>
          </p>
          <Image
            src={Pen}
            alt=" Pen"
            objectFit=""
            className="w-12 h-12 object-cover rounded-full -ml-72 z-10 -mb-8"
          />
          <div className="w-full bg-white rounded-lg shadow border sm:max-w-md xl:p-0 border-blue-700">
            <div className="p-6 space-y-4 sm:p-8 ">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 sm:text-2xl mt-4">
                Create an account
              </h1>
              <form
                onSubmit={(e) => {
                  signupAction(e);
                }}
                className="space-y-4 sm:space-y-6"
                action="#"
              >
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    name="name"
                    onChange={(e) => {
                      setUser({ ...user, name: e.target.value });
                    }}
                    placeholder="e.g Rahman"
                    className={`bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 `}
                    required=""
                  />
                </div>
                <div>
                  <label className=" mb-2 text-sm font-medium text-blue-700">
                    Username
                  </label>
                  <input
                    value={user.username}
                    name="username"
                    onChange={(e) => {
                      setUser({ ...user, username: e.target.value });
                    }}
                    placeholder="e.g @omotayo"
                    className={`bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 `}
                    required=""
                  />
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-blue-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    value={user.password}
                    name="password"
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                    }}
                    placeholder="at least 8 characters long"
                    className={`bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 `}
                    required=""
                  />
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start"></div>
                </div>
                <button
                  onClick={signupAction}
                  type="submit"
                  className={`w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                    buttonDisabled
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-600"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Signing up..." : "Create account"}
                </button>

                <p className="text-sm font-light text-black-500">
                  Already have an account{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:underline "
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      ;
    </div>
  );
}

export default Signup
