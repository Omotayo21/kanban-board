
'use client'
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

import PostDetails from '../../_components/PostDetails'
import Loader2 from '../../_components/Loader2';

export default function Fulldetails ({params}) {
 ;
 const postId = params.id
 const fetchPostById = async (id) => {
   const { data } = await axios.get(`/api/feedbacks/feedback/${id}?id=${id}`);
   return data;
 };

 const {
   data: feedback,
   error,
   isLoading,
 } = useQuery({
   queryKey: ["feedback", postId],
   queryFn: () => fetchPostById(postId),
   enabled: !!postId,
 });

 if (isLoading) return <Loader2 />;
 if (error) return <div>Error fetching post</div>;

    return (
        <>
      
  <PostDetails postId={postId} />

        </>
    )
}




