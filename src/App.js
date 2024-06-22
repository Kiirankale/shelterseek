import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Offers from "./Pages/Offers";
import SignIn from "./Pages/SignIn";
import Forgotpassword from "./Pages/Forgotpassword";
import SignUp from "./Pages/SignUp";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Offers" element={<Offers />} />
        <Route path="/sign-In" element={<SignIn />} />
        <Route path="/sign-Up" element={<SignUp />} /> 
        <Route path="/Forgot-password" element={<Forgotpassword />} />
      </Routes>
    </Router>
  );
}

export default App;
