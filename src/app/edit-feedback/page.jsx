'use client'
import React, { useState } from 'react'
import Link from 'next/link';
import {CaretLeft, CaretDown, CaretUp} from 'phosphor-react';
import Add from '../../../public/shared/icon-edit-feedback.svg'
import Image from 'next/image'

const CreateFeedback = () => {
    const categories = ["enhancement", "feature", "bug", "UI", "UX"];
    const [name, setName] = useState("");
    const [details, setDetails] = useState("");
    const [category, setCategory] = useState("Features");
    const [dropdown, setDropdown] = useState(false);
    const create = () => {};
    const drop = () => {
      if (dropdown) {
        setDropdown(false);
      } else {
        setDropdown(true);
      }
    };
    const chooseCategory = (categorie) => {
      setCategory(categorie);
      setDropdown(false);
    };
  return (
    <div>
      <section className="bg-white ">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto sm:max-w-md md:h-screen lg:py-0 lg:mt-16 sm:mt-4 mb-8">
          <Link href="/Home">
            <p className="text-black flex flex-row text-sm gap-x-1 lg:-ml-72 sm:-ml-48 mb-8 font-semibold hover:underline">
              {" "}
              <CaretLeft size={16} className="mt-1" /> <span>Go back</span>
            </p>
          </Link>
          <Image
            src={Add}
            alt=" Pen"
            objectFit=""
            className="w-12 h-12 object-cover rounded-full lg:-ml-72 z-10 -mb-8"
          />
          <div className="w-full bg-red-500 rounded-lg shadow border sm:max-w-md  border-blue-700">
            <div className="p-6 space-y-4 sm:p-8 ">
              <h1 className="lg:text-[1.35rem] font-bold  tracking-tight text-blue-700 sm:text-2xl mt-4">
                Editing 'Add a dark theme option'
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
                    value={name}
                    name="name"
                    onChange={(e) => {
                      setName(e.target.value);
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
                  <label className="block  text-sm text-blue-700 font-bold">
                    Update status
                  </label>
                  <p className="text-blue-700 text-[0.65rem] mb-2">
                    Change feature state
                  </p>
                  <div className="bg-gray-50 border border-blue-300 text-gray-900 sm:text-sm rounded-lg  w-full h-10 p-2.5 flex flex-row justify-between cursor-pointer ">
                    <p className="font-bold text-sm text-blue-800">Planned</p>
                    <CaretDown size={12} />
                  </div>
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
                    value={details}
                    onChange={(e) => {
                      setDetails(e.target.value);
                    }}
                    className="bg-gray-200 rounded-md p-1 text-sm outline-none w-full h-24"
                  ></textarea>
                </div>

                <div className="flex lg:flex-row sm:flex-col lg:gap-x-4 sm:gap-y-4 lg:ml-24 sm:ml-16">
                  <button
                    type="submit"
                    className="lg:w-20 sm:w-36 text-white bg-blue-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={create}
                    type="submit"
                    className="w-36 text-white bg-purple-700 hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Add feedback
                  </button>
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
