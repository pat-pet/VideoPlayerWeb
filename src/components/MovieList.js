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
      <h1 className="text-lg font-bold pt-5 tracking-tight text-white">Vidio List</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8 ">
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
                    <span aria-hidden="true" className="absolute inset-0" />
                    {movie.title}
                  </a>
                </h3>
                <div className="flex items-start mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#FFC609" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                  </svg>
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
