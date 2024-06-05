"use client";
import { useEffect, useState } from "react";
import {FaUserLarge} from 'react-icons/fa6'
import { CaretUp, CaretLeft, UserCircle, User } from "phosphor-react";
import Image from "next/image";
import commentIcon from "../../../public/shared/icon-comments.svg";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader2 from "../_components/Loader2";
import { useRouter } from "next/navigation";

const PostDetails = ({ postId }) => {

 
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setloading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [isPopUp, setIsPopUp] = useState(null);
  const [dropDownInput, setDropDownInput] = useState(null); // Holds the comment ID being replied to
  const [newReplyText, setNewReplyText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
const openModal = () => {
  setIsPopUp(true)
}
 const dropdownReply = (commentId) => {
   setDropDownInput(commentId);
  setIsPopUp(false)
 };
const cancel = () => {
  setIsPopUp(null)
}
   useEffect(() => {
     if (newCommentText.length > 0 || newReplyText.length > 0) {
       setDisabled(false);
     } else {
       setDisabled(true);
     }
   }, [newCommentText, newReplyText]);
 const [dataId, setData] = useState("");
 const [userId, setUserId] = useState(null);

 const getUserDetails = async () => {
   const res = await axios.get("/api/users/me");
   console.log(res.data);
   setData(res.data.data._id);
    setUserId(res.data.data);
 };
 useEffect(() => {
   getUserDetails();
 }, []);
const fetchPostById = async (id) => {
  const { data } = await axios.get(`/api/feedbacks/feedback/${id}?id=${id}`);
  return data;
}





  const { data: feedback, error, isLoading, refetch } = useQuery({
    queryKey: ['feedback', postId],
    queryFn: () => fetchPostById(postId),
    enabled: !!postId,
  });


  if (isLoading) return <Loader2 />;
  if (error) return <div>Error fetching post</div>
  if (!feedback || feedback.length === 0) {
    return <div>No posts found</div>;
  }

  




const postComment = async () => {
setloading(true)
    try {
      const response = await axios.post(
        `/api/feedbacks/feedback/${postId}/addComments?id=${postId}`,
        { newCommentText, dataId }
      );
      console.log('Comment added:', response.data);
      // Optionally, clear the form or provide feedback to the user
      setNewCommentText('');
      refetch()
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally{
      setloading(false)
    }
  }

  const handleReplySubmit = async (commentId, username ) => {
    setloading(true);
try {
  const response = await axios.post(`/api/feedbacks/feedback/${commentId}/addReply?id=${commentId}`, {
    newReplyText,
   username,
    dataId,
  })
  console.log('Reply added', response.data)
  setNewReplyText('')
  setDropDownInput(null)
  refetch()
}
  catch(error){
console.error('Error adding reply', error)
  } finally{
    setloading(false)
  }
  }

  const deleteComment = async (postId) => {
    setloading(true)
  try {
    await axios.delete(
      `/api/feedbacks/feedback/${postId}/addComments?id=${postId}`
    );
    refetch();
    setIsPopUp(null);
  } catch (error) {
    console.error("error in deleting");
  } finally {
    setloading(false);
  }
  }
   const deleteReply = async (replyId) => {
     try {
       await axios.delete(
         `/api/feedbacks/feedback/${replyId}/addReply?id=${replyId}`
       );
       refetch();
       setIsPopUp(false);
     } catch (error) {
       console.error("error in deleting");
     } finally {
       setloading(false);
     }
   };
 const handleUpvote = async (feedbackId) => {
   try {
     await axios.patch(
       `http://localhost:3000/api/feedbacks/feedback/${feedbackId}/upvotes?id=${String(feedbackId)}`,
       {
         dataId : userId._id
       }
     );

console.log(feedbackId)
     refetch();
     getUserDetails();
   } catch (error) {
     console.log(error);
   }
 };
  //const hasUpvoted = userId?.upvotedPosts?.includes(feedback._id) || '';
const hasUpvoted = userId && userId.upvotedPosts && userId.upvotedPosts.includes(feedback._id)
 
 



 

  return (
  <>
    <div
      className={`flex flex-col gap-y-8 mt-16 mb-8 items-center justify-center `}
    >
      {loading && <Loader2 />}
      <Link href="/home">
        <p className="text-black flex flex-row text-sm gap-x-1 lg:-ml-72 sm:-ml-36 mb-8 font-semibold hover:underline">
          <CaretLeft size={16} className="mt-1" /> <span>Go back</span>
        </p>
      </Link>

      <div
        key={feedback._id}
        className="border border-blue-700 cursor-pointer flex flex-row gap-x-8 lg:w-[45rem] sm:w-full p-4 sm:px-6 rounded-md bg-gray-100"
      >
        <button
          onClick={(e) => {
            e.preventDefault()
          

            handleUpvote(feedback._id);}
          }
          className={`flex flex-col font-semibold p-2 w-9 h-12 rounded-md ${
            hasUpvoted ? "bg-blue-800 text-white" : "bg-white text-black"
          } `}
        >
          <CaretUp size={12} className="ml-1" />
          {feedback.upvotes}
        </button>
        <div className="flex flex-col gap-y-2">
          <p className="text-black font-bold">{feedback.title}</p>
          <p className="text-black text-sm">{feedback.description}</p>
          <p className="bg-gray-200 rounded-md p-2 text-blue-900 font-bold text-sm w-auto ">
            {feedback.category}
          </p>
        </div>
        
        <p className="flex flex-end">
          <Image src={commentIcon} alt="comment icon" className="w-5 h-5 " />
          {feedback.comments?.length || 0}
        </p>
      </div>

      <div className="flex flex-col border border-blue-700 cursor-pointer lg:w-[45rem] h-auto p-4 rounded-md bg-gray-100">
        {feedback.comments.map((comment) => (
          <div
            key={comment._id}
            className="flex flex-col gap-y-1 mt-4 border-b border-black pb-2"
          >
            <div className="flex flex-row justify-between gap-x-8">
              <div className="flex flex-row gap-x-4">
                {comment.user?.image ? (
                  <Image
                    src={comment.user.image}
                    alt={`${comment.user.name}'s profile picture`}
                    width={40}
                    height={40}
                    className="rounded-full w-auto"
                  />
                ) : (
                  <FaUserLarge size={24} className="rounded-full" />
                )}

                <div className="flex flex-col">
                  <h3 className="font-bold text-blue-700 text-xl">
                    {comment.user.name}
                  </h3>
                  <p className="text-sm text-purple-600 font-bold">
                    @{comment.user.username}
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-x-3">
                {dataId === comment.user?._id ? (
                  <p
                    onClick={() => setIsPopUp(comment._id)}
                    className="font-bold text-sm text-purple-700"
                  >
                    Delete
                  </p>
                ) : null}

                <p
                  className="font-bold text-sm text-blue-700"
                  onClick={() =>
                    dropdownReply(comment._id, comment.user.username)
                  }
                >
                  Reply
                </p>
              </div>
            </div>

            <p className="lg:mt-4 sm:mt-4 ml-16">{comment.content}</p>
            {comment.replies.map((reply) => (
              <div key={reply.id} className=" flex flex-col gap-y-1 ml-24 pb-2">
                <div className="flex flex-row justify-between">
                  {" "}
                  <div className="flex flex-col">
                    <h3 className="font-bold text-blue-700 ">
                      {reply.user.name}
                    </h3>
                    <p className="text-sm text-purple-600 font-bold">
                      @{reply.user.username}
                    </p>
                  </div>
                  <div className="flex flex-row gap-x-3 flex-end">
                    {dataId === reply.user._id ? (
                      <p
                        onClick={() => deleteReply(reply._id)}
                        className="font-bold text-sm text-purple-700"
                      >
                        Delete
                      </p>
                    ) : null}
                  </div>
                </div>
                <p className="text-sm text-gray-800 font-semibold">
                  <span className="text-purple-700">@{reply.replyingTo}</span>{" "}
                  {reply.content}
                </p>
              </div>
            ))}
            {dropDownInput === comment._id && (
              <div className="sm:w-full">
                <div className="lg:ml-28 flex flex-col mt-4">
                  <label className="font-bold text-blue-700">Reply</label>
                  <input
                    value={newReplyText}
                    onChange={(e) => {
                      setNewReplyText(e.target.value);
                    }}
                    className={`bg-gray-50 border border-blue-300 text-gray-900 text-sm rounded-lg lg:w-[30rem] p-3 mt-4`}
                    required=""
                    placeholder="Type your reply here"
                  />
                  <div className="flex flex-row justify-between mt-4">
                    <p className="text-sm text-gray-400">250 characters left</p>
                    <button
                      onClick={() =>
                        handleReplySubmit(comment._id, comment.user.username)
                      }
                      className={`w-36 text-white hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                        disabled ? "bg-gray-400 cursor-disabled" : "bg-red-700"
                      }`}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isPopUp === comment._id && (
              <div className="fixed left-0 top-0 z-[9999] flex h-full w-full items-center justify-center bg-opacity-80 bg-black">
                <div className="h-40 w-64 rounded-md z-[3] flex-col justify-center border-blue-800 bg-white p-2 mt-8">
                  <h3 className="text-lg">
                    Are you sure you want to delete?
                  </h3>
                  <div className="flex flex-row ml-4 gap-x-6 mt-4 ">
                    <button
                      onClick={cancel}
                      className={`w-24 h-8 text-white p-1  hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-md text-sm text-center bg-blue-500`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className={`w-24 h-8 p-1 text-white hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-md text-sm  text-center bg-red-700`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="border border-blue-700 cursor-pointer flex sm:flex-col lg:flex-row gap-x-8 lg:w-[45rem] sm:w-full m-4 h-48 p-4 rounded-md bg-gray-100 pl-8">
        <div className="flex sm:flex-col">
          <label htmlFor="email" className="font-bold text-blue-700">
            Add comment
          </label>

          <input
            value={newCommentText}
            onChange={(e) => {
              setNewCommentText(e.target.value);
            }}
            className={`bg-gray-50 border border-blue-300 text-gray-900 text-sm rounded-lg lg:w-[40rem] p-3 mt-4`}
            required=""
            placeholder="Type your comment here"
            maxLength={250}
          />
          <div className="flex flex-row justify-between mt-4">
            <p
              className={`text-sm text-gray-400 ${
                newCommentText.length > 250 ? "text-red-500" : "text-gray-400"
              }`}
            >
              {250 - newCommentText.length} characters left
            </p>
            <button
              onClick={postComment}
              className={`w-36 text-white hover:bg-primary-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                disabled ? "bg-gray-400 cursor-disabled" : "bg-purple-700"
              }`}
            >
              Post comment
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PostDetails;
