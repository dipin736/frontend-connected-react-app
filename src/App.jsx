import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import EmailVerification from "./components/EmailVerification";
import MainLayout from "./components/Home/MainLayout";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/ForgotPassword";
import Stories from "./components/Story/Stories";
import ChatSystem from "./components/Chat/ChatSystem";
import Profile from "./components/Profile/Profile";
import Oldpage from "./components/Story/oldstoreisdat";
import { ProtectedComponent } from "./endpoint/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/verify"
        element={
          <ProtectedComponent>
            <EmailVerification />
          </ProtectedComponent>
        }
      />
      <Route
        path="/forgotpassword"
        element={
          <ProtectedComponent>
            <ForgotPassword />
          </ProtectedComponent>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedComponent>
            <MainLayout />
          </ProtectedComponent>
        }
      />
      <Route
        path="/chatsystem"
        element={
          <ProtectedComponent>
            <ChatSystem />
          </ProtectedComponent>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <ProtectedComponent>
            <Profile />
          </ProtectedComponent>
        }
      />
      <Route
        path="/stories"
        element={
          <ProtectedComponent>
            <Stories />
          </ProtectedComponent>
        }
      />
      <Route
        path="/old"
        element={
          <ProtectedComponent>
            <Oldpage />
          </ProtectedComponent>
        }
      />

      <Route
        exact
        path="/"
        element={
          <ProtectedComponent>
            <Navigate to="/login" />
          </ProtectedComponent>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
