import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Components
import Leftdashboard from "./Leftdashboard";
import Dashboardnav from "./Dashboardnav";

// Style
import profilecss from "../../styles/Dashboard Styles/profile.module.scss";

// Images
import userAvatar from "../../assets/avatar.png";
import { FaLock } from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({});
  const [bioNull, setBioNull] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");

    if (token === null) {
      navigate("/");
    } else {
      async function getUserInfo() {
        let userData = (
          await axios.post("http://localhost:500/getuserinfo", {
            authkey: process.env.REACT_APP_AUTH_KEY,
            usertoken: token,
          })
        ).data;

        if (userData.status) {
          setUserData(userData.userInfo);
          setLoaded(true);
          if (bioNull === false) {
            document.getElementsByClassName(
              `${profilecss.bio}`
            )[0].innerText = `${userData.userInfo.bio}`;
          }
          setBioNull(false);
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
  }, [navigate, bioNull]);

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
          {loaded ? (
            <Userprofile
              profilePic={userData.profilePic}
              username={userData.username}
              name={userData.name}
              privateStatus={userData.privateStatus}
              posts={userData.posts}
              followers={userData.followers}
              following={userData.following}
              loaded={loaded}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}

function Userprofile({
  profilePic,
  username,
  name,
  privateStatus,
  posts,
  followers,
  following,
}) {
  return (
    <>
      <div className={profilecss.profileContainer}>
        <div className={profilecss.topcomponents}>
          <div className={profilecss.userInfo}>
            <div className={profilecss.userTopInfo}>
              <div className={profilecss.userImg}>
                {profilePic === "" ? (
                  <img src={userAvatar} alt="avatar" />
                ) : (
                  <img src={profilePic} alt="avatar" />
                )}
              </div>
              <div className={profilecss.sideInfo}>
                <p>
                  {privateStatus ? <FaLock /> : null}
                  {username}
                </p>
                <div className={profilecss.connectionInfo}>
                  <div className={profilecss.noOfPosts}>
                    <p>{posts.length}</p>
                    <p>posts</p>
                  </div>
                  <div className={profilecss.noOfFollowers}>
                    <p>{followers.length}</p>
                    <p>followers</p>
                  </div>
                  <div className={profilecss.noOfFollowing}>
                    <p>{following.length}</p>
                    <p>following</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={profilecss.mainInfo}>
              <div className={profilecss.name}>
                <p>
                  {privateStatus ? <FaLock /> : null}
                  {username}
                </p>
              </div>
              <div className={profilecss.connectionDetails}>
                <p>
                  <b>{posts.length}</b> posts
                </p>
                <p>
                  <b>{followers.length}</b> followers
                </p>
                <p>
                  <b>{following.length}</b> following
                </p>
              </div>
              <div className={profilecss.name}>
                <p>{name}</p>
              </div>
              <div className={profilecss.bio}></div>
              <div className={profilecss.profileEditingSharing}>
                <Link to={"/dashboard/editprofile"}>Edit Profile</Link>
                <Link to={"/dashboard/shareprofile"}>Share Profile</Link>
              </div>
            </div>
          </div>
        </div>
        <div className={profilecss.bottomcomponents}>
          <div className={profilecss.category}>
            <p>POSTS</p>
          </div>
          <div className={profilecss.posts}>
            <img
              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/09/instagram-image-size.jpg"
              alt="img"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
