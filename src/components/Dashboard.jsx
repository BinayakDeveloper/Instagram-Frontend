import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Styles
// import dashboardcss from "../styles/Dashboard Styles/dashboard.module.scss";

// Components
import Leftdashboard from "./Dashboard Components/Leftdashboard";
import Dashboardnav from "./Dashboard Components/Dashboardnav";

function Dashboard() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");

    if (token === null) {
      navigate("/");
    } else {
      async function getUserInfo() {
        let userData = (
          await axios.post(
            "https://instaflixrootserver.vercel.app/getuserinfo",
            {
              authkey: process.env.REACT_APP_AUTH_KEY,
              usertoken: token,
            }
          )
        ).data;

        if (userData.status) {
          setLoaded(true);
        } else {
          toast.error(userData.response);
          setTimeout(() => {
            localStorage.removeItem("user-ssid-token-ig");
            navigate("/");
          }, 1500);
        }
      }

      getUserInfo();
    }
  }, [navigate]);

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />
      <div className="dashboardContainer">
        <div className="leftSide">
          <Leftdashboard />
        </div>
        <div className="mainContent">
          <Dashboardnav />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
