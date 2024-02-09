import Leftdashboard from "./Leftdashboard";
import Dashboardnav from "./Dashboardnav";

function Notification() {
  return (
    <>
      <div className="dashboardContainer">
        <div className="leftSide">
          <Leftdashboard />
        </div>
        <div className="mainContent">
          <Dashboardnav />
          <p>Notification</p>
        </div>
      </div>
    </>
  );
}

export default Notification;
