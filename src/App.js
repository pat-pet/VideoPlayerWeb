import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MovieList from "./components/MovieList";
import WatchingMovie from "./components/WatchingMovie";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/watch/:id" element={<WatchingMovie />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
