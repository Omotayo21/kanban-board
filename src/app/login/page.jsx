"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CaretLeft } from "phosphor-react";
import Pen from "../../../public/shared/icon-edit-feedback.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const validateUsername = () => {
    if (user.username.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid username",
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

  const loginAction = async (e) => {
    e.preventDefault();
    if (validateUsername() && validatePassword()) {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/login", user);

        router.push("/home");
        toast.success("login success");
        console.log("login success", response.data);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
        setNotification({
          type: "error",
          message: "incorrect username or password",
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
    if (user.username.length > 0 && user.password.length > 7) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div>
      <section className="bg-gray-50 sm:h-screen md:h-full ">
        <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto sm:max-w-md md:h-screen lg:py-0">
        
          <Image
            src={Pen}
            alt=" Pen"
            objectFit=""
            className="w-12 h-12 object-cover rounded-full -ml-72 z-10 -mb-8"
          />
          <div className="w-full bg-white rounded-lg shadow border sm:max-w-md xl:p-0 border-blue-700">
            <div className="p-6 space-y-4 sm:p-8 ">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 sm:text-2xl mt-4">
                Sign in
              </h1>
              <form
                onSubmit={(e) => {
                  loginAction(e);
                }}
                className="space-y-4 sm:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-blue-700"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    name="name"
                    onChange={(e) => {
                      setUser({ ...user, username: e.target.value });
                    }}
                    placeholder="e.g omotay21"
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
                    placeholder="at least 6 characters long"
                    className={`bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 `}
                    required=""
                  />
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start"></div>
                </div>
                <button
                  onClick={loginAction}
                  type="submit"
                  className={`w-full text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                    buttonDisabled
                      ? "bg-purple-300 cursor-not-allowed"
                      : "bg-purple-600"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Authenticating..." : "Sign in"}
                </button>

                <p className="text-sm font-light text-black-500">
                  Don't have an account yet?{" "}
                  <Link
                    to="/signup"
                    href="signup"
                    className="font-medium text-blue-600 hover:underline "
                  >
                    Sign up
                  </Link>
                </p>
              </form>
              {notification && (
                <div
                  className={`pt-4 left-0 w-full p-4 text-white bg-red-600 text-center`}
                >
                  {notification.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      ;
    </div>
  );
};

export default Login;
