'use client'
import React from 'react'
import { Medal, SignOut} from 'phosphor-react'
import Link from 'next/link'


const Navbar = ({datalength, onSort}) => {
 const logout = async () => {
   try {
     await axios.get("/api/users/logout");
     router.push("/login");
   } catch (error) {
     console.log(error.message);
     toast.error(error.message);
   }
 };
  const token  = (NextRequest) => { NextRequest.cookies.get("token")?.value || ""};
  return (
    <>
    
      <div className=" top-1 lg:fixed lg:left-[21rem] sm:mt-16 lg:mt-2 ">
        <div className=" lg:w-[62rem]  h-16 bg-black lg:rounded-md flex flex-row p-2 lg:gap-x-5 sm:gap-x-5  sm:w-full ">
          <Medal size={24} className="text-white mt-2 " />
          <h2 className="font-semibold sm:text-sm  text-white mt-2 ">
            <span>{datalength}</span> suggestions
          </h2>
          <div className="lg:ml-[26rem] sm:ml-12 flex flex-row gap-x-8 md:ml-[20rem]">
            <button className="lg:w-40 lg:h-12 sm:w-24 sm:h-8 bg-purple-600 text-white font-semibold sm:mt-2 lg:mt-0 rounded-md sm:text-[0.6rem] lg:text-sm">
              {" "}
              <Link href="/create-feedback" className="">
                {" "}
                + Add feedback
              </Link>
            </button>
           { token ? ( <button onClick={logout} className="">
              <SignOut size={44} className="bg-white text-black p-4 rounded-md" />{" "}
            </button>): null}
           
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar
