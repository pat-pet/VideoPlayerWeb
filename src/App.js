import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MovieList from "./components/MovieList";
import WatchingMovie from "./components/WatchingMovie";
import "./App.css"

function App() {
  return (
    <Router>
      <div className="App">
        <div className="min-h-full">
          <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<MovieList />} />
                <Route path="/watch/:id" element={<WatchingMovie />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;

