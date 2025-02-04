import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId="177821530322-qir0bd588g2ku5dcmp7t7hcja6jecea1.apps.googleusercontent.com">
  <App />
  </GoogleOAuthProvider>    
  </BrowserRouter>
);
