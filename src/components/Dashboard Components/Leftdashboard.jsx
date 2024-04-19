import { Link } from "react-router-dom";

// Styles
import leftcss from "../../styles/Dashboard Styles/leftdashboard.module.scss";

// Images
import igImg from "../../assets/igwhitetext.png";
import { GrHomeRounded } from "react-icons/gr";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { RiMessengerLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { FaRegSquarePlus } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { FaInstagram } from "react-icons/fa6";

function Leftdashboard() {
  return (
    <>
      <div className={leftcss.leftDashboardContainer}>
        <div className={leftcss.leftComponents}>
          <div className={leftcss.topComponents}>
            <Link to={"/dashboard"}>
              <img src={igImg} alt="igimg" />
              <FaInstagram />
            </Link>

            <div className={leftcss.pageLinks}>
              <div className={leftcss.home}>
                <Link to={"/dashboard"}>
                  <GrHomeRounded />
                  <p>Home</p>
                </Link>
              </div>

              <div className={leftcss.searchUser}>
                <Link to={"/dashboard/search"}>
                  <HiMiniMagnifyingGlass />
                  <p>Search</p>
                </Link>
              </div>

              <div className={leftcss.create}>
                <Link to={"/dashboard/create"}>
                  <FaRegSquarePlus />
                  <p>Create</p>
                </Link>
              </div>

              <div className={leftcss.notification}>
                <Link to={"/dashboard/notification"}>
                  <FaRegHeart />
                  <p>Notifications</p>
                </Link>
              </div>

              <div className={leftcss.message}>
                <Link to={"/dashboard/message"}>
                  <RiMessengerLine />
                  <p>Messages</p>
                </Link>
              </div>

              <div className={leftcss.profile}>
                <Link to={"/dashboard/profile"}>
                  <CgProfile />
                  <p>Profile</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Leftdashboard;
