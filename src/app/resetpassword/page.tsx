'use client'
import { useRouter } from "next/navigation";
import React,{useState, useEffect} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppSelector } from "../redux/hook";
import logodark from "../assets/logo-dark.svg";
import logolight from "../assets/logo-light.svg";
import Image from "next/image";
const ForgotPasswordReset = () => {
   const { darkMode } = useAppSelector((state) => state.ui);
    const [token, setToken] = useState('')
      const [newpassword, setNewPassword] = useState('')
        const [confirmNewPassword, setConfirmNewPassword] = useState('')
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState("")

        const router = useRouter()

        const resetpasswordHandler = async () => {

          if(!newpassword || !confirmNewPassword){
         toast.error('passwords cannot be empty')
         return
          }
          if(newpassword !== confirmNewPassword){
            toast.error('Passwords do not match')
            return
          }
         try {
          if (token.length > 0){
           setLoading(true)
          const user = await axios.post('/api/resetpassword', {
            token,
            newpassword,
            
           })
           console.log(user)
           toast.success('Password changed sucessfully')
           router.push('/login')
          }
         } catch(error : any){
           toast.error(error.response.data.data)
           setError(error)
         } finally {
          setLoading(false)
         }
        }
useEffect(()=> {
const urlToken = window.location.search.split('=')[1];
setToken(urlToken || "");
}, [])
return (
  <>
    {error && (
      <div className="flex justify-center bg-gray-200 border border-green-700 w-64 ">
        <h3 className="text-xl text-red-500 m-3 p-3">{error}</h3>
      </div>
    )}
    <div className="flex flex-row items-center justify-center mt-20">
      <div className=" flex flex-col items-center justify-center gap-y-12 lg:w-[40rem] lg:h-[30rem] sm:w-[22rem] sm:h-[28rem] bg-white border border-black">
        <Image
          src={darkMode ? logolight : logodark}
          alt="Logo"
          className="w-[200px] ml-5 mt-5 sm:hidden md:flex"
        />
        <h1 className="font-bold text-3xl">
          {" "}
          {loading ? "Processing" : "Reset your Password"}
        </h1>
        <input
          type="password"
          value={newpassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="lg:w-96 sm:w-72 sm:h-8 rounded-md lg:h-12 border border-black pl-2"
          placeholder="Enter your new password"
        />
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          placeholder="Confirm your new password"
          className="lg:w-96 sm:w-72 sm:h-8 rounded-md lg:h-12 border border-black pl-2"
        />
        <button
          className="bg-indigo-500 text-white font-medium lg:w-64 lg:h-12 sm:w-48 sm:h-8 rounded-md border border-blue-500"
          onClick={resetpasswordHandler}
        >
          {" "}
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </div>
    </div>
  </>
);
}

export default ForgotPasswordReset
