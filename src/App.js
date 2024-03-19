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
import Pnf from "./components/Pnf";

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
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/dashboard/search" Component={Search} />
        <Route path="/dashboard/create" Component={Create} />
        <Route path="/dashboard/notification" Component={Notification} />
        <Route path="/dashboard/message" Component={Message} />
        <Route path="/dashboard/profile" Component={Profile} />
        <Route path="/dashboard/editprofile" Component={Editprofile} />
        <Route path="/dashboard/shareprofile" Component={Shareprofile} />
        <Route path="/dashboard/search/:username" Component={User} />
        <Route path="*" Component={Pnf} />
      </Routes>
    </Router>
  );
}

export default App;
