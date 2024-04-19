import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { HashLink } from "react-router-hash-link";

// Style
import profilecss from "../../styles/Dashboard Styles/profile.module.scss";

// Images
import userAvatar from "../../assets/avatar.png";
import { FaLock } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";

function Profile({ Leftdashboard, Dashboardnav, Componentloader }) {
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
          await axios.post("https://instameserver.vercel.app/getuserinfo", {
            authkey: process.env.REACT_APP_AUTH_KEY,
            usertoken: token,
          })
        ).data;

        if (userData.status) {
          document.title = `${userData.userInfo.name} (@${userData.userInfo.username}) • Instagram photos`;
          setUserData(userData.userInfo);
          setLoaded(true);
          try {
            if (bioNull === false) {
              document.getElementsByClassName(
                `${profilecss.bio}`
              )[0].innerText = `${userData.userInfo.bio}`;
            }
          } catch (e) {}
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

    return () => {
      document.title = "Instagram";
    };
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
            <>
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
            </>
          ) : (
            <Componentloader />
          )}
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
                    <HashLink to={"#postarea"}>
                      <p>{posts.length}</p>
                      <p>posts</p>
                    </HashLink>
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
                  <HashLink to={"#postarea"}>
                    <b>{posts.length}</b> posts
                  </HashLink>
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
          <div className={profilecss.posts} id="postarea">
            {posts.length === 0 ? (
              <NoPost />
            ) : (
              posts.reverse().map(({ postUrl, userToken, postToken }, ind) => {
                return (
                  <Post
                    key={ind}
                    url={postUrl}
                    userToken={userToken}
                    id={postToken}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NoPost() {
  return (
    <>
      <div className={profilecss.noPost}>
        <IoCameraOutline />
        <label>No Posts Yet</label>
      </div>
    </>
  );
}

function Post({ url, userToken, id }) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={profilecss.userPost}
        onClick={() => {
          navigate(`/dashboard/post/${userToken}/${id}`);
        }}
      >
        <img src={url} alt={"Post "} />
      </div>
    </>
  );
}

export default Profile;
