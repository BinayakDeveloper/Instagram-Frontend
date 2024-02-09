import Leftdashboard from "./Leftdashboard";
import Dashboardnav from "./Dashboardnav";

function Create() {
  return (
    <>
      <div className="dashboardContainer">
        <div className="leftSide">
          <Leftdashboard />
        </div>
        <div className="mainContent">
          <Dashboardnav />
          <p>Create</p>
        </div>
      </div>
    </>
  );
}

export default Create;
