'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import {CaretLeft, CaretDown, CaretUp} from 'phosphor-react';
import Add from '../../../public/shared/icon-new-feedback.svg'
import Image from 'next/image'
import {toast} from 'react-toastify'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateFeedback = () => {
  const router = useRouter()
  const [dataId, setData] = useState("nothing");

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  const categories = [ "enhancement", "feature", "bug", "UI", "UX"];
    const [title, setTitle] = useState('')
      const [description, setDescription] = useState('')
      const [category, setCategory] = useState('Features')
      const [dropdown, setDropdown] = useState(false)
      const [empty, setEmpty] = useState(false);
    const create = async (e) => {
      e.preventDefault()
      if(title !== "" && description !=="" && category !==""){
        try {
          const response = await axios.post("/api/feedbacks/createFeedback", {
            dataId,
            title,
            description,
            category,
          });
 router.push("/home");
 toast.success("Feedback created successfully");
 console.log("create success", response.data);
         
        } catch (error) {
          console.log(error)
          toast.error(error)
        }
      }
  if (title == "" || description == "" || category == "") {
    setEmpty(true);
  }
    }
    const drop = () => {
  if(dropdown) {setDropdown(false)}
  else{
    setDropdown(true)
  }
    }
    const chooseCategory = (categorie) => {
    setCategory(categorie)
    setDropdown(false)
    }
  return (
    <div className=''>
      <section className="bg-gray-200  lg:h-full md:h-full ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto sm:max-w-md md:h-screen lg:py-0 lg:h-full  ">
          <Link href="home">
            <p className="text-black flex flex-row text-sm gap-x-1 lg:-ml-72 sm:-ml-48 mb-6 font-semibold lg:mt-12 ">
              {" "}
              <CaretLeft size={16} className="mt-1" /> <span>Go back</span>
            </p>
          </Link>
          <Image
            src={Add}
            alt=" Pen"
            objectFit=""
            className="w-12 h-12 object-cover rounded-full -ml-72 z-10 -mb-8"
          />
          <div className="w-full bg-white rounded-lg shadow border sm:max-w-md xl:p-0 border-blue-700 lg:mb-12">
            <div className="p-6 space-y-4 sm:p-8 ">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-blue-700 sm:text-2xl mt-4">
                Create New feedback
              </h1>
              <form
                onSubmit={(e) => {
                  create(e);
                }}
                className="space-y-4 sm:space-y-6"
                action="#"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-blue-700"
                  >
                    Feedback title
                  </label>
                  <p className="text-blue-600 text-[0.65rem] mb-2">
                    Add a short descriptive headline
                  </p>
                  <input
                    value={title}
                    name="name"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                    className={`bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 `}
                    required=""
                  />
                </div>
                <div>
                  <label className="block  text-sm text-blue-700 font-bold">
                    Category
                  </label>
                  <p className="text-blue-700 text-[0.65rem] mb-2">
                    Choose a category for your feedback
                  </p>
                  <div className="bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg  w-full h-10 p-2.5 flex flex-row justify-between cursor-pointer ">
                    <input
                      value={category}
                      type="text"
                      readOnly
                      className="font-bold text-sm text-blue-800"
                    />
                    <button onClick={drop}>
                      {dropdown ? (
                        <CaretUp size={12} />
                      ) : (
                        <CaretDown size={12} />
                      )}
                    </button>
                  </div>

                  {dropdown && (
                    <div className="bg-gray-200 border border-black rounded-md h-[9.2rem] ">
                      {categories.map((categorie, index) => (
                        <div key={index} className="border-b border-black">
                          <button
                            onClick={() => chooseCategory(categorie)}
                            className="text-blue-600  px-3 py-1 text-sm "
                          >
                            {categorie}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-blue-700 font-bold">
                    Feedback Detail
                  </label>
                  <p className="text-blue-700 text-[0.65rem] mb-2">
                    Include any specific comments on what should be improved,
                    added e.t.c
                  </p>
                  <textarea
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    className="bg-gray-200 rounded-md p-1 text-sm outline-none w-full h-24"
                  ></textarea>
                </div>

                <div className="flex lg:flex-row sm:flex-col lg:gap-x-4 lg:ml-24 sm:ml-4 sm:gap-y-4">
                  <button
                    type="submit"
                    className="w-48 text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={create}
                    type="submit"
                    className="w-48 text-white bg-purple-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Add feedback
                  </button>
                  {empty && (
                    <p className="text-red-600">
                      {" "}
                      pls fill all inputs and select a category
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      ;
    </div>
  );
}

export default CreateFeedback
