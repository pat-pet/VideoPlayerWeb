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
  limit,
  getDocs,
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
      orderBy("created_at", "asc")
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
      <h1 className="text-2xl font-bold pt-6 tracking-tight text-white">
        <button
          onClick={() => {
            videoRef.current.pause();
            window.history.back();
          }}>
          Back
        </button>
      </h1>
      <div class="flex flex-row">
        <div class="basis-3/5 mt-6 bg-[#595959] rounded-b-md">
          <video ref={videoRef} width="100%" height="100%" controls>
            <source src={movie.url} type="video/mp4" />
          </video>
          <div className="pl-4 pt-4">
            <p className="text-lg text-white">{movie.title}</p>
            <p className="text-sm text-white">{movie.subtitle}</p>
          </div>
          <div class="relative">
            <div class="absolute right-0 h-16 w-16">09</div>
          </div>
        </div>
        <div class="basis-2/5">02</div>
      </div>
      <h1>Watching Movie</h1>

      <div>
        <input
          type="text"
          placeholder="Tulis komentar..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Kirim Komentar</button>
      </div>
      <h3>Komentar:</h3>
      <ul>
        {comments.map((comment, index) => (
          <li key={index}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default WatchingMovie;
