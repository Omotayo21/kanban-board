 'use client'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useState, Suspense, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '../_components/Sidebar';
import Navbar from '../_components/Navbar';
import { CaretUp, List, X } from 'phosphor-react';
import empty from "../../../public/suggestions/illustration-empty.svg";
import commentIcon from "../../../public/shared/icon-comments.svg";
import Loader from '../_components/Loader'
import mobilebg from '../../../public/suggestions/mobile/background-header.png'

 const queryClient = new QueryClient();
const fetchPosts = async () => {
  const { data } = await axios.get('/api/feedbacks/feedback');
  return data;
};
const fetchUser = async () => {
  const { data } = await axios.get("/api/users/me");
  return data.data;
};



const PostList = () => {
   const [dropDown, setDropDown] = useState(false);
  const [dataId, setData] = useState("");
  const [userId, setUserId] = useState([]); 
   const getUserDetails = async () => {
   const res = await axios.get("/api/users/me");
   console.log(res.data);
   setData(res.data.data._id);
   setUserId(res.data.data)
 };
 useEffect(() => {
   getUserDetails();
 }, []);
  
 const [selectedCategory, setSelectedCategory] = useState('All')
  const { data: feedbacks, error, isLoading, refetch  } = useQuery({queryKey:['feedbacks'], queryFn: fetchPosts});
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
    
  } = useQuery({ queryKey: ["user"], queryfn: fetchUser });
 
 
  const handleUpvote = async (feedbackId) => {
    try {
       await axios.patch(`api/feedbacks/feedback/${feedbackId}/upvotes?id=${feedbackId}`,{
        dataId
      })
         
      queryClient.invalidateQueries({queryKey:['feedbacks']})
      queryClient.invalidateQueries({queryKey:['user']})
      refetch()
    getUserDetails()
    
    } catch (error) {
     
      console.log(error)
    }
  };
  if (isLoading || userLoading) return (<div><Loader /></div>);
  if (error ) { console.log(error); return (<div>Error fetching posts</div>)};
  if(!feedbacks || feedbacks.length === 0 ) {return (<div>No posts found</div>)}
 

  const filteredPosts = selectedCategory === 'All' ? feedbacks : feedbacks.filter((feedback) => feedback.category === selectedCategory )
 
  const popOut = () => {
    setDropDown(true)
  }
  const popIn = () => {
    setDropDown(false)
  }
  
  return (
    <>
      <div className="flex lg:flex-row sm:flex-col gap-x-8 sm:w-full sm:h-full">
        <div className=" sm:w-full h-16 relative sm:fixed lg:hidden z-[9999]">
          <Image
            src={mobilebg}
            alt=" mobile Background"
            objectFit=""
            className="w-full h-full object-cover   "
          />
          <div className=" inset-0 absolute pt-2 pl-4 flex flex-row justify-between pr-4">
            <div className="flex flex-col">
              <h1 className=" font-semibold text-white">Rahman's space</h1>
              <h2 className="text-gray-200 text-sm">Feedback Board</h2>
            </div>
           { !dropDown ? ( <List onClick={popOut} size={20} className="text-white mt-4 font-bold" /> ) : (
            <button onClick={popIn} className="h-8 text-white font-bold">
              <X size={20} />
            </button>)}
          </div>
        </div>
        <Navbar datalength={filteredPosts.length} />
        <div className="sm:hidden lg:flex">
          <Sidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
        {dropDown && <Sidebar popIn={popIn} />}
        <Suspense fallback={"loading ur fucking data"}>
          <div className="flex flex-col gap-y-8 lg:mt-28 ml-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const hasUpvoted = userId?.upvotedPosts.includes(
                  post._id.toString()
                );
                return (
                  <div
                    key={post._id}
                    className="flex flex-col items-center justify-center sm:w-auto"
                  >
                    <Link
                      href={`/home/${post._id}`}
                      className="border-2 border-blue-700 cursor-pointer flex flex-row justify-between gap-x-8 lg:w-[65rem] sm:w-[22.8rem] md:w-[43rem] sm:-ml-7 lg:p-4 sm:p-1 rounded-md bg-gray-100 sm:mt-4 lg:mt-0"
                    >
                      <div className="flex flex-row gap-x-8">
                        <button
                          onClick={(e) => {
                            e.preventDefault();

                            handleUpvote(post._id);
                          }}
                          className={`flex lg:flex-col sm:flex-row sm:text-sm font-semibold ${
                            hasUpvoted
                              ? "bg-blue-700 text-white "
                              : "bg-white text-black"
                          } p-2  lg:h-12 sm:h-10 rounded-md`}
                        >
                          <CaretUp size={12} className="lg:ml-1" />{" "}
                          {post.upvotes}
                        </button>

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
                      </div>
                      <p className="mr-16 flex flex-row gap-x-1 ">
                        <Image
                          src={commentIcon}
                          alt="comment icon"
                          className="lg:w-6 lg:h-5 sm:w-8 sm:h-4 sm:mt-1"
                        />
                        <span className="font-bold">
                          {post.comments?.length || 0}
                        </span>
                      </p>
                    </Link>
                  </div>
                );
              })
            ) : (
              <Image src={empty} alt="empty" className="ml-12 w-24 h-24" />
            )}
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default PostList