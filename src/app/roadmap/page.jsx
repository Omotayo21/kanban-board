"use client";
import React, { useState, useEffect } from "react";
import { CaretLeft, CaretUp } from "phosphor-react";
import Image from "next/image";
import commentIcon from "../../../public/shared/icon-comments.svg";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loader2 from "../_components/Loader2";

const fetchPosts = async () => {
  const { data } = await axios.get("/api/feedbacks/feedback");
  return data;
};

const Roadmap = () => {
  const [selectedCategory, setSelectedCategory] = useState("planned");
  const [plannedPosts, setPlannedPosts] = useState([]);
  const [inProgressPosts, setInProgressPosts] = useState([]);
  const [livePosts, setLivePosts] = useState([]);

  const {
    data: feedbacks,
    error,
    isLoading,
    refetch,
  } = useQuery({ queryKey: ["feedbacks"], queryFn: fetchPosts });

  useEffect(() => {
    if (feedbacks) {
      const planned = feedbacks.filter(
        (request) => request.status === "planned"
      );
      const inProgress = feedbacks.filter(
        (request) => request.status === "in-progress"
      );
      const live = feedbacks.filter((request) => request.status === "live");

      setPlannedPosts(planned);
      setInProgressPosts(inProgress);
      setLivePosts(live);
    }
  }, [feedbacks]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 700;

  const getPostsToDisplay = () => {
    if (!isMobile) {
      return {
        planned: plannedPosts,
        inProgress: inProgressPosts,
        live: livePosts,
      };
    }
    switch (selectedCategory) {
      case "planned":
        return { planned: plannedPosts, inProgress: [], live: [] };
      case "in-progress":
        return { planned: [], inProgress: inProgressPosts, live: [] };
      case "live":
        return { planned: [], inProgress: [], live: livePosts };
      default:
        return { planned: [], inProgress: [], live: [] };
    }
  };

  const { planned, inProgress, live } = getPostsToDisplay();

  if (isLoading) return <Loader2 />;
  if (error) return <div>Error fetching posts</div>;
  if (!feedbacks || feedbacks.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <>
      <div className="lg:top-16 absolute lg:left-[10rem] sm:w-full">
        <div className="lg:w-[67rem] sm:w-full h-20 bg-blue-900 lg:rounded-md flex flex-row p-4 gap-x-5">
          <div className="flex flex-col gap-y-2 ml-8">
            <Link
              href="/home"
              className="text-white flex flex-row text-sm gap-x-1"
            >
              <CaretLeft size={16} className="mt-1" />{" "}
              <span className="text-[0.7rem]">Go back</span>
            </Link>
            <h2 className="text-white font-bold">Roadmap</h2>
          </div>
          <button className="w-40 h-12 bg-purple-800 text-white font-semibold lg:ml-[47rem] sm:ml-12 rounded-md">
            <Link href="/create-feedback">+ Add feedback</Link>
          </button>
        </div>

        {isMobile && (
          <div className="flex items-center justify-between lg:hidden sm:w-full border-b px-[2.4rem] pt-8">
            <p
              onClick={() => setSelectedCategory("planned")}
              className={
                selectedCategory === "planned"
                  ? "text-yellow-600 font-bold underline"
                  : ""
              }
            >
              Planned
            </p>
            <p
              onClick={() => setSelectedCategory("in-progress")}
              className={
                selectedCategory === "in-progress"
                  ? "text-purple-700 font-bold underline"
                  : ""
              }
            >
              In-progress
            </p>
            <p
              onClick={() => setSelectedCategory("live")}
              className={
                selectedCategory === "live"
                  ? "text-green-700 font-bold underline"
                  : ""
              }
            >
              Live
            </p>
          </div>
        )}

        {!isMobile ? (
          <div className="flex flex-row mt-6 mb-4 gap-x-14">
            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-blue-900">
                  Planned({plannedPosts.length})
                </h3>
                <p className="text-sm text-blue-900">
                  Ideas prioritized for research
                </p>
              </div>
              {plannedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  status="Planned"
                  borderColor="border-yellow-600"
                  dotColor="bg-yellow-600"
                  refetch={refetch}
                />
              ))}
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-blue-900">
                  In-progress({inProgressPosts.length})
                </h3>
                <p className="text-sm text-blue-900">
                  Currently being developed
                </p>
              </div>
              {inProgressPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  status="In-progress"
                  borderColor="border-purple-600"
                  dotColor="bg-purple-600"
                  refetch={refetch}
                />
              ))}
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <h3 className="font-bold text-blue-900">
                  Live({livePosts.length})
                </h3>
                <p className="text-sm text-blue-900">Released Features</p>
              </div>
              {livePosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  status="Live"
                  borderColor="border-green-600"
                  dotColor="bg-green-600"
                  refetch={refetch}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center mt-6  mb-4 gap-y-14">
            <div className="flex flex-col gap-y-4">
              {selectedCategory === "planned" &&
                planned.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    status="Planned"
                    borderColor="border-yellow-600"
                    dotColor="bg-yellow-600"
                    refetch={refetch}
                  />
                ))}
              {selectedCategory === "in-progress" &&
                inProgress.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    status="In-progress"
                    borderColor="border-purple-600"
                    dotColor="bg-purple-600"
                    refetch={refetch}
                  />
                ))}
              {selectedCategory === "live" &&
                live.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    status="Live"
                    borderColor="border-green-600"
                    dotColor="bg-green-600"
                    refetch={refetch}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const PostCard = ({ post, status, borderColor, dotColor, refetch }) => {
  const [userId, setUserId] = useState(null);

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);

    setUserId(res.data.data);
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  const handleUpvote = async (feedbackId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/feedbacks/feedback/${feedbackId}/upvotes?id=${String(
          feedbackId
        )}`,
        {
          dataId: userId._id,
        }
      );

      console.log(feedbackId);
      refetch();
      getUserDetails();
    } catch (error) {
      console.log(error);
    }
  };

  const hasUpvoted =
    userId && userId.upvotedPosts && userId.upvotedPosts.includes(post._id);
  return (
    <Link
      href={`/home/${post._id}`}
      className={`border-b-4 border-t-4 ${borderColor} w-[20rem] h-[14.5rem] bg-blue-100 flex flex-col gap-y-2 p-4 rounded-md`}
    >
      <div className="flex items-center gap-[0.8rem]">
        <div className={`rounded-full h-3 w-3 ${dotColor}`}></div>
        <p className="text-sm text-blue-900">{status}</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <p className="text-blue-900 font-bold">{post.title}</p>
        <p className="text-blue-900 text-sm">{post.description}</p>
        <div className="bg-gray-200 rounded-md p-2 text-blue-900 font-bold text-sm w-9">
          <p>{post.category}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <p
          onClick={(e) => {
            e.preventDefault();

            handleUpvote(post._id);
          }}
          className={`flex flex-row font-semibold p-2 w-16 gap-x-1 h-10 rounded-md ${
            hasUpvoted ? "bg-blue-800 text-white" : "bg-white text-black"
          } `}
        >
          <CaretUp size={12} className="mt-1" />
          {post.upvotes}
        </p>
        <p className="flex flex-row font-bold text-blue-800 gap-x-1">
          <Image src={commentIcon} alt="comment icon" className="w-5 h-5" />
          {post.comments?.length || 0}
        </p>
      </div>
    </Link>
  );
};

export default Roadmap;
