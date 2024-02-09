import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Styles
// import dashboardcss from "../styles/Dashboard Styles/dashboard.module.scss";

// Components
import Leftdashboard from "./Dashboard Components/Leftdashboard";
import Dashboardnav from "./Dashboard Components/Dashboardnav";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");

    if (token === null) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
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
