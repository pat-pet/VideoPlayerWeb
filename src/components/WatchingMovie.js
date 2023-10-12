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
  setDoc,
} from "firebase/firestore";

function WatchingMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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
      orderBy("created_at", "asc"),
      limit(10)
    );

    getDocs(commentsQuery)
      .then((querySnapshot) => {
        const commentList = [];
        querySnapshot.forEach((doc) => {
          commentList.push(doc.data());
        });
        setComments(commentList);
      })
      .catch((error) => {
        console.error("Error getting comments: ", error);
      });
  }, [id]);

  const handleLike = async () => {
    if (movie) {
      const db = getFirestore();
      const movieRef = doc(db, "content_videos", id);
      await updateDoc(movieRef, {
        likes: increment(1),
      });
      setMovie({ ...movie, likes: movie.likes + 1 });
    }
  };

  const handleDislike = async () => {
    if (movie) {
      const db = getFirestore();
      const movieRef = doc(db, "content_videos", id);
      await updateDoc(movieRef, {
        dislikes: increment(1),
      });
      setMovie({ ...movie, dislikes: movie.dislikes + 1 });
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment && movie && !isSubmittingComment) {
      setIsSubmittingComment(true);

      const db = getFirestore();
      const commentsRef = collection(db, "comments");

      try {
        await addDoc(commentsRef, {
          content: newComment,
          content_videos: doc(db, "content_videos", id),
          created_at: new Date(),
        });

        setComments((prevComments) => [
          ...prevComments,
          { content: newComment, created_at: new Date() },
        ]);

        setNewComment("");
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
      <button
        onClick={() => {
          videoRef.current.pause();
          window.history.back();
        }}>
        Back
      </button>
      <h1>Watching Movie</h1>
      <video ref={videoRef} width="100%" height="100%" controls>
        <source src={movie.url} type="video/mp4" />
      </video>
      <h2>{movie.title}</h2>
      <p>{movie.subtitle}</p>
      <p>
        Likes: {movie.likes} <button onClick={handleLike}>Like</button>
      </p>
      <p>
        Dislikes: {movie.dislikes}{" "}
        <button onClick={handleDislike}>Dislike</button>
      </p>
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
