import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Offers from "./Pages/Offers";
import SignIn from "./Pages/SignIn";
import Forgotpassword from "./Pages/Forgotpassword";
import SignUp from "./Pages/SignUp";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./Pages/Create-listing";
import EditListing from "./Pages/EditListing"
import Listing from "./Pages/Listing"




function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/Offers" element={<Offers />} />
          <Route path="/category/:categoryName/:listingId" element={<Listing/>} />
          <Route path="/sign-In" element={<SignIn />} />
          <Route path="/sign-Up" element={<SignUp />} />
          <Route path="/Forgot-password" element={<Forgotpassword />} />
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing/>} />
          </Route>

        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
