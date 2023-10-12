import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCck6EXyQY2JSqfrJZNOf2Fv2XPXfiWYWA",
  authDomain: "video-player-63f87.firebaseapp.com",
  projectId: "video-player-63f87",
  storageBucket: "video-player-63f87.appspot.com",
  messagingSenderId: "710116458991",
  appId: "1:710116458991:web:c88a5de9fe73616e00361a",
  measurementId: "G-EVP23Q4FFL",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
