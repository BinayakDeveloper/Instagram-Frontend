import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Stylesheets
import "./styles/index.scss";

// Components
const Login = lazy(() => import("./components/Login"));
const Forgot = lazy(() => import("./components/Forgot"));
const Register = lazy(() => import("./components/Register"));
const Otp = lazy(() => import("./components/Otp"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Changepass = lazy(() => import("./components/Changepass"));
const Search = lazy(() => import("./components/Dashboard Components/Search"));
const Notification = lazy(() =>
  import("./components/Dashboard Components/Notification")
);
const Create = lazy(() => import("./components/Dashboard Components/Create"));
const Message = lazy(() => import("./components/Dashboard Components/Message"));
const Profile = lazy(() => import("./components/Dashboard Components/Profile"));
const User = lazy(() => import("./components/Dashboard Components/User"));
const Editprofile = lazy(() =>
  import("./components/Dashboard Components/Editprofile")
);
const Shareprofile = lazy(() =>
  import("./components/Dashboard Components/Shareprofile")
);
const Post = lazy(() => import("./components/Dashboard Components/Post"));
const Pnf = lazy(() => import("./components/Pnf"));

// Common Components
const Leftdashboard = lazy(() =>
  import("./components/Dashboard Components/Leftdashboard")
);
const Dashboardnav = lazy(() =>
  import("./components/Dashboard Components/Dashboardnav")
);
const Componentloader = lazy(() =>
  import("./components/Dashboard Components/Componentloader")
);
const Userloader = lazy(() =>
  import("./components/Dashboard Components/Userloader")
);

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
    <Suspense>
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
    </Suspense>
  );
}

export default App;
