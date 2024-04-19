import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Login from "./components/Login";
import Forgot from "./components/Forgot";
import Register from "./components/Register";
import Otp from "./components/Otp";
import Dashboard from "./components/Dashboard";
import Changepass from "./components/Changepass";
import Search from "./components/Dashboard Components/Search";
import Notification from "./components/Dashboard Components/Notification";
import Create from "./components/Dashboard Components/Create";
import Message from "./components/Dashboard Components/Message";
import Profile from "./components/Dashboard Components/Profile";
import User from "./components/Dashboard Components/User";
import Editprofile from "./components/Dashboard Components/Editprofile";
import Shareprofile from "./components/Dashboard Components/Shareprofile";
import Post from "./components/Dashboard Components/Post";
import Pnf from "./components/Pnf";

// Common Components
import Leftdashboard from "./components/Dashboard Components/Leftdashboard";
import Dashboardnav from "./components/Dashboard Components/Dashboardnav";
import Componentloader from "./components/Dashboard Components/Componentloader";
import Userloader from "./components/Dashboard Components/Userloader";

// Stylesheets
import "./styles/index.scss";

function App() {
  useEffect(() => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "F12") e.preventDefault();
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
        e.preventDefault();
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c")
        e.preventDefault();
      else if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "j")
        e.preventDefault();
    });
  });
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/otp/:usertoken" Component={Otp} />
        <Route path="/forgot-password" Component={Forgot} />
        <Route
          path="/changepass/:forgottoken/:usertoken"
          Component={Changepass}
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
              Userloader={Userloader}
            />
          }
        />
        <Route
          path="/dashboard/search"
          element={
            <Search
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
              Userloader={Userloader}
            />
          }
        />
        <Route
          path="/dashboard/create"
          element={
            <Create
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/notification"
          element={
            <Notification
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/message"
          element={
            <Message
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <Profile
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/editprofile"
          element={
            <Editprofile
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/shareprofile"
          element={
            <Shareprofile
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/search/:username"
          element={
            <User
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route
          path="/dashboard/post/:postusertoken/:posttoken"
          element={
            <Post
              Leftdashboard={Leftdashboard}
              Dashboardnav={Dashboardnav}
              Componentloader={Componentloader}
            />
          }
        />
        <Route path="*" Component={Pnf} />
      </Routes>
    </Router>
  );
}

export default App;
