import navcss from "../../styles/Dashboard Styles/dashboardnav.module.scss";

import igImg from "../../assets/igwhitetext.png";
import { RiMessengerLine } from "react-icons/ri";
import { Link } from "react-router-dom";

function Dashboardnav() {
  return (
    <>
      <div className={navcss.navContainer}>
        <div className={navcss.igImg}>
          <img src={igImg} alt="igimg" />
        </div>
        <div className={navcss.messenger}>
          <Link to={"/dashboard/message"}>
            <RiMessengerLine />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Dashboardnav;
