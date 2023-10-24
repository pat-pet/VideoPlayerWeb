import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  orderBy,
  addDoc,
  where,
  onSnapshot,
} from "firebase/firestore";

function WatchingMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [isUpdatingDislike, setIsUpdatingDislike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const db = getFirestore();
    const movieRef = doc(db, "content_videos", id);

    getDoc(movieRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setMovie(docSnap.data());
        } else {
          console.error("Movie not found");
        }
      })
      .catch((error) => {
        console.error("Error getting movie: ", error);
      });

    const commentsRef = collection(db, "comments");
    const commentsQuery = query(
      commentsRef,
      where("content_videos", "==", doc(db, "content_videos", id)),
      orderBy("created_at", "desc")
    );

    const likeDislikeRef = doc(db, "content_videos", id);
    onSnapshot(likeDislikeRef, (docSnap) => {
      const data = docSnap.data();
      if (data) {
        setLikeCount(data.likes || 0);
        setDislikeCount(data.dislikes || 0);
      }
    });

    const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
      const commentList = [];
      querySnapshot.forEach((doc) => {
        commentList.push(doc.data());
      });
      setComments(commentList);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  const handleLike = async () => {
    if (movie && !isUpdatingLike) {
      setIsUpdatingLike(true);
      const db = getFirestore();
      const movieRef = doc(db, "content_videos", id);
      await updateDoc(movieRef, {
        likes: increment(1),
      });
      setLikeCount(likeCount + 1);
      setIsUpdatingLike(false);
    }
  };

  const handleDislike = async () => {
    if (movie && !isUpdatingDislike) {
      setIsUpdatingDislike(true);
      const db = getFirestore();
      const movieRef = doc(db, "content_videos", id);
      await updateDoc(movieRef, {
        dislikes: increment(1),
      });
      setDislikeCount(dislikeCount + 1);
      setIsUpdatingDislike(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment && movie && !isSubmittingComment) {
      setIsSubmittingComment(true);

      const db = getFirestore();
      const commentsRef = collection(db, "comments");

      try {
        const existingComment = comments.find(
          (comment) => comment.content === newComment
        );
        if (!existingComment) {
          await addDoc(commentsRef, {
            content: newComment,
            content_videos: doc(db, "content_videos", id),
            created_at: new Date(),
          });
          setNewComment("");
        }
      } catch (error) {
        console.error("Error submitting comment: ", error);
      } finally {
        setIsSubmittingComment(false);
      }
    }
  };

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold pt-5 tracking-tight text-white">
        <div className="relative">
          <div className="absolute grid mb-2 grid-cols-3 items-center justify-center">
            <button
              onClick={() => {
                videoRef.current.pause();
                window.history.back();
              }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <p className="col-span-2">Video Detail</p>
          </div>
        </div>
      </h1>
      <div className="flex pt-7 flex-row lg:h-[620px]">
        <div className="basis-3/5 mt-6 bg-[#4C4C4C] rounded-b-md ">
          <div className="grid grid-cols-10 gap-4">
            <div className="col-span-10">
              <video ref={videoRef} width="100%" height="100%" controls>
                <source src={movie.url} type="video/mp4" />
              </video>
            </div>
            <div className="col-span-5 pl-6">
              <p className="font-bold text-lg text-white">{movie.title}</p>
            </div>
            <div className="col-start-1 col-span-9 pl-6">
              <p className="text-sm text-white truncate">{movie.subtitle}</p>
            </div>
            <div className="col-start-8 col-span-3 ml-12">
              <div className="grid grid-cols-2 h-[38px] w-[130px] bg-[#595959] items-center justify-center rounded-md">
                <button onClick={handleLike} className="w-full h-full">
                  <div className="flex items-stretch justify-center w-full h-full hover:bg-[#363636] pt-1.5 rounded-l-md">
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-5 h-5 mr-2 mt-0.5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                        />
                      </svg>
                    </div>
                    <div className="">
                      <p className="text-white text-base font-semibold">
                        {likeCount}
                      </p>
                    </div>
                  </div>
                </button>
                <button onClick={handleDislike} className="w-full h-full">
                  <div className="flex items-stretch justify-center w-full h-full pt-1.5 hover:bg-[#363636] rounded-r-md">
                    <div className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="w-5 h-5 mr-2 mt-1">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"
                        />
                      </svg>
                    </div>
                    <div className="">
                      <p className="text-white text-base font-semibold">
                        {dislikeCount}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-2/5 ml-2 pr-4 pt-6 mt-6 pl-4 bg-[#4C4C4C] rounded-b-md">
          <div className="grid grid-cols-10 gap-4 mb-4">
            <div className="col-span-9">
              <input
                type="text"
                id="base-input"
                placeholder="Leave a comment as anonymous..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="border border-white text-white text-sm rounded-lg block w-full p-2.5 bg-[#4C4C4C] placeholder:text-white"
              />
            </div>
            <button onClick={handleCommentSubmit}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-auto h-auto">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto lg:h-[460px]">
            {comments.map((comment, index) => (
              <div className="grid grid-cols-1">
                <div
                  key={index}
                  className="bg-[#595959] mt-2 text-justify p-3 rounded-md">
                  <p className="text-white">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchingMovie;
