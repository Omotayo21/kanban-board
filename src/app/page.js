
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CaretUp } from "phosphor-react";
import Link from "next/link";

import Image from "next/image";

import Sidebar from "./_components/Sidebar";
import { Suspense } from "react";
import Navbar from "./_components/Navbar";
import empty from "../../public/suggestions/icon-suggestions.svg";
import commentIcon from "../../public/shared/icon-comments.svg";


const Page = () => {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [posts, setPosts] = useState([]);
  const [userData, setUserData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [filteredData, setFilteredData] = useState([]);

 
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("./data.json");
        const data = await response.json();
        setPosts(data);
        setFilteredData(data.productRequests);
        setUserData(data.currentUser || {});
      } catch (error) {
        console.error("error fetching data", error);
      }
    }
    fetchData();
    setCategoryFilter("All");
  }, []);

  const handleCategoryFilter = (category) => {
    if (category === "All") {
      setFilteredData(posts.productRequests);
    } else {
      const filtered = posts.productRequests.filter(
        (request) => request.category === category
      );
      setFilteredData(filtered);
    }
    setCategoryFilter(category);
  };

  const handleSort = (criteria) => {
    setFilteredData((prevData) => {
      let sortedData = [...prevData];
      switch (criteria) {
        case "upvotesAsc":
          sortedData.sort((a, b) => a.upvotes - b.upvotes);
          break;
        case "upvotesDesc":
          sortedData.sort((a, b) => b.upvotes - a.upvotes);
          break;
        case "commentsAsc":
          sortedData.sort(
            (a, b) => (a.comments?.length || 0) - (b.comments?.length || 0)
          );
          break;
        case "commentsDesc":
          sortedData.sort(
            (a, b) => (b.comments?.length || 0) - (a.comments?.length || 0)
          );
          break;
        default:
          break;
      }
      return sortedData;
    });
  };

  return (
    <div className="flex flex-row gap-x-8 sm:w-full">
      <Navbar datalength={filteredData.length} onSort={handleSort} />
      <Sidebar onCategoryFilter={handleCategoryFilter} />

      <Suspense fallback={"loading data..."}>
        <div className="flex flex-col gap-y-8 lg:mt-28 ml-8">
          {filteredData.length > 0 ? (
            filteredData.map((post) => (
              <div key={post.id} className="">
                {" "}
                <Link
                  href={`/home/${post.id}`}
                  className="border-2 border-blue-700 cursor-pointer flex flex-row gap-x-8 lg:w-[65rem] sm:w-full sm:-ml-4 p-4 rounded-md bg-gray-100"
                >
                  <p className="flex lg:flex-col sm:flex-row sm:text-sm font-semibold bg-gray-300 p-2 w- lg:h-12 sm:h-10 rounded-md">
                    <CaretUp size={12} className="lg:ml-1" /> {post.upvotes}
                  </p>
                  <div className="flex flex-col gap-y-2">
                    <p className="text-black font-bold sm:text-sm">
                      {post.title}
                    </p>
                    <p className="text-blue-900 text-[0.8rem]">
                      {post.description}
                    </p>
                    <div className="rounded-md text-blue-900 font-bold bg-gray-200 p-2">
                      <p className="text-[0.7rem]"> {post.category}</p>
                    </div>
                  </div>
                  <p className="flex flex-end">
                    <Image
                      src={commentIcon}
                      alt="comment icon"
                      className="w-8 h-5"
                    />
                    <span>{post.comments?.length || 0}</span>
                  </p>
                  
                </Link>
              </div>
            ))
          ) : (
            <Image src={empty} className="ml-12 w-24 h-24" />
          )}
        </div>
      </Suspense>
    </div>
  );
};

export default Page;
