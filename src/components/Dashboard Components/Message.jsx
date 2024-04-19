function Message({ Leftdashboard, Dashboardnav, Componentloader }) {
  return (
    <>
      <div className="dashboardContainer">
        <div className="leftSide">
          <Leftdashboard />
        </div>
        <div className="mainContent">
          <Dashboardnav />
          <p>Message</p>
        </div>
      </div>
    </>
  );
}

export default Message;
