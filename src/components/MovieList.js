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
      <h1 className="text-2xl font-bold pt-6 tracking-tight text-white">Vidio List</h1>
      <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8 ">
        {movies.map((movie) => (
          <div key={movie.id} className="group relative bg-[#363636] rounded-b-md lg:w-44">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden lg:aspect-none group-hover:opacity-75 lg:h-60 lg:w-44">
              <img
                src={`https://source.unsplash.com/300x200/?${movie.thumbnail_url}`}
                alt={movie.title}
                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <div className="ml-3 mb-3">
                <h3 className="text-md text-white">
                  <a href={`/watch/${movie.id}`}>
                    <span aria-hidden="true" className="absolute inset-0"/>
                    {movie.title}
                  </a>
                </h3>
                <div class="flex items-start">
                  <img className="mt-1 mr-2" src={require("../iconamoon_like-fill.png")}/>
                  <p className="text-sm text-gold-text">{movie.likes}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
