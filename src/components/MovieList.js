import React, { useState, useEffect } from "react";
import Movie from "../models/Movie"; // Impor model data Movie
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function MovieList() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Ambil data film dari Firestore
    const db = getFirestore();
    const moviesRef = collection(db, "content_videos");

    getDocs(moviesRef)
      .then((querySnapshot) => {
        const movieList = [];
        querySnapshot.forEach((doc) => {
          movieList.push({ ...doc.data(), id: doc.id });
        });
        setMovies(movieList);
      })
      .catch((error) => {
        console.error("Error getting movies: ", error);
      });
  }, []);
  return (
    <div>
      <h1>Movie List</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <img
              src={`https://source.unsplash.com/300x200/?${movie.title}`}
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p>{movie.subtitle}</p>
            <p>likes: {movie.likes}</p>
            <p>dislikes: {movie.dislikes}</p>
            <Link to={`/watch/${movie.id}`}>Watch Movie</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
