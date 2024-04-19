import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Components
import Pnf from "../Pnf";
import Leftdashboard from "./Leftdashboard";
import Dashboardnav from "./Dashboardnav";
import Componentloader from "./Componentloader";

// Styles
import usercss from "../../styles/Dashboard Styles/user.module.scss";

// Assets
import userAvatar from "../../assets/avatar.png";
import { FaLock } from "react-icons/fa";
import { IoCameraOutline } from "react-icons/io5";

function User() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [userToken, setUserToken] = useState("");
  const [validPage, setValidPage] = useState(false);
  const [userData, setUserData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [bioLoad, setBioLoad] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");
    setUserToken(token);

    if (token === null) {
      navigate("/");
    } else {
      async function getSearchedUserData() {
        let userData = (
          await axios.post(
            "https://instameserver.vercel.app/getsearchuserinfo",
            {
              authkey: process.env.REACT_APP_AUTH_KEY,
              usertoken: token,
              username,
            }
          )
        ).data;

        if (userData.status) {
          if (userData.response === "Redirect to profile") {
            navigate("/dashboard/profile");
          } else {
            document.title = `${userData.searchedUserInfo.name} (@${userData.searchedUserInfo.username}) • Instagram photos`;
            setUserData(userData.searchedUserInfo);
            setValidPage(true);
            setBioLoad(true);

            if (bioLoad) {
              let userBioContainer = document.getElementsByClassName(
                `${usercss.userbio}`
              );
              try {
                userBioContainer[0].innerText = userData.searchedUserInfo.bio;
              } catch (error) {}
            }
          }
        } else {
          setValidPage(false);
        }
        setLoaded(true);
      }
      getSearchedUserData();
    }
  }, [navigate, setUserData, username, bioLoad]);

  // Follow User

  async function followUser(e) {
    e.target.textContent = "Requesting...";
    e.target.style.pointerEvents = "none";
    let followStatus = await axios.post(
      "https://instameserver.vercel.app/followuser",
      {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: userData.token,
      }
    );

    if (followStatus.data.status) {
      let userData = (
        await axios.post("https://instameserver.vercel.app/getsearchuserinfo", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: userToken,
          username,
        })
      ).data;

      if (userData.status) {
        setUserData(userData.searchedUserInfo);
      }
    } else {
      toast.error(followStatus.data.response);
    }
    e.target.style.pointerEvents = "auto";
  }

  // Unfollow User

  async function unfollowUser(e) {
    e.target.textContent = "Requesting...";
    e.target.style.pointerEvents = "none";
    let unfollowStatus = await axios.post(
      "https://instameserver.vercel.app/unfollowuser",
      {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: userData.token,
      }
    );

    if (unfollowStatus.data.status) {
      let userData = (
        await axios.post("https://instameserver.vercel.app/getsearchuserinfo", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: userToken,
          username,
        })
      ).data;

      if (userData.status) {
        setUserData(userData.searchedUserInfo);
      }
    } else {
      toast.error(unfollowStatus.data.response);
    }
    e.target.style.pointerEvents = "auto";
  }

  // Cancel Request
  async function removeRequest(e) {
    e.target.textContent = "Requesting...";
    let removeStatus = (
      await axios.post("https://instameserver.vercel.app/removefollowrequest", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: userData.token,
      })
    ).data;

    if (removeStatus.status) {
      let userData = (
        await axios.post("https://instameserver.vercel.app/getsearchuserinfo", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: userToken,
          username,
        })
      ).data;

      if (userData.status) {
        setUserData(userData.searchedUserInfo);
      }
    } else {
      toast.error(removeStatus.data.response);
    }
  }

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
            validPage ? (
              <>
                <div className={usercss.userContainer}>
                  <div className={usercss.userComponents}>
                    <div className={usercss.topComponents}>
                      <div className={usercss.topLeftComponents}>
                        <div className={usercss.userpic}>
                          {userData.profilePic === "" ? (
                            <img src={userAvatar} alt="avatar" />
                          ) : (
                            <img src={userData.profilePic} alt="userdp" />
                          )}
                        </div>

                        <div className={usercss.userInfoMob}>
                          <div className={usercss.userConInfo}>
                            <div className={usercss.userposts}>
                              <p>{userData.posts.length}</p>
                              <p>posts</p>
                            </div>
                            <div className={usercss.userfollowers}>
                              <p>{userData.followers.length}</p>
                              <p>followers</p>
                            </div>
                            <div className={usercss.userfollowing}>
                              <p>{userData.following.length}</p>
                              <p>following</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={usercss.topRightComponents}>
                        <div className={usercss.userInfoPc}>
                          <div className={usercss.username}>
                            <p>
                              {userData.privateStatus === 1 ? <FaLock /> : null}
                              {userData.username}
                            </p>
                          </div>
                          <div className={usercss.userConInfo}>
                            <div className={usercss.userposts}>
                              <p>{userData.posts.length}</p>
                              <p>posts</p>
                            </div>
                            <div className={usercss.userfollowers}>
                              <p>{userData.followers.length}</p>
                              <p>followers</p>
                            </div>
                            <div className={usercss.userfollowing}>
                              <p>{userData.following.length}</p>
                              <p>following</p>
                            </div>
                          </div>
                          <div className={usercss.name}>
                            <p>{userData.name}</p>
                          </div>

                          <div className={usercss.userbio}></div>

                          <div className={usercss.followbutton}>
                            {userData.followers.includes(userToken) ? (
                              <button
                                id="following"
                                onClick={unfollowUser}
                                style={{
                                  background: "transparent",
                                  width: "100%",
                                  border: "2px solid #ccc",
                                  outline: "0",
                                  color: "white",
                                  fontWeight: "bold",
                                  letterSpacing: "0.8px",
                                  padding: "8px 10px",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                Following
                              </button>
                            ) : userData.followRequests.includes(userToken) ? (
                              <button
                                className="reqSent"
                                onClick={removeRequest}
                                style={{
                                  background: "rgb(74, 74, 74)",
                                  width: "100%",
                                  border: "2px solid transparent",
                                  outline: "0",
                                  color: "white",
                                  fontWeight: "bold",
                                  letterSpacing: "0.8px",
                                  padding: "8px 10px",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                Request sent
                              </button>
                            ) : (
                              <button
                                className="follow"
                                onClick={followUser}
                                style={{
                                  background: "rgb(0, 149, 246)",
                                  width: "100%",
                                  border: "2px solid transparent",
                                  outline: "0",
                                  color: "white",
                                  fontWeight: "bold",
                                  letterSpacing: "0.8px",
                                  padding: "8px 10px",
                                  borderRadius: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                Follow
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={usercss.bottomComponents}>
                      {userData.privateStatus === 1 ? (
                        userData.followers.includes(userToken) ? (
                          <>
                            <div className={usercss.category}>
                              <p>POSTS</p>
                            </div>
                            {userData.posts.length === 0 ? (
                              <NoPost />
                            ) : (
                              <div className={usercss.posts}>
                                {userData.posts
                                  .reverse()
                                  .map(
                                    (
                                      { postUrl, userToken, postToken },
                                      ind
                                    ) => {
                                      return (
                                        <Post
                                          url={postUrl}
                                          ind={ind}
                                          userToken={userToken}
                                          postToken={postToken}
                                          key={ind}
                                        />
                                      );
                                    }
                                  )}
                              </div>
                            )}
                          </>
                        ) : (
                          <PrivateAccount />
                        )
                      ) : userData.posts.length === 0 ? (
                        <NoPost />
                      ) : (
                        <>
                          <div className={usercss.category}>
                            <p>POSTS</p>
                          </div>
                          <div className={usercss.posts}>
                            {userData.posts
                              .reverse()
                              .map(({ postUrl, userToken, postToken }, ind) => {
                                return (
                                  <Post
                                    url={postUrl}
                                    ind={ind}
                                    userToken={userToken}
                                    postToken={postToken}
                                    key={ind}
                                  />
                                );
                              })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Pnf />
            )
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

function PrivateAccount() {
  return (
    <>
      <div className={usercss.privateAccMsg}>
        <p>This Account is Private</p>
        <p>Follow to see their photos and videos.</p>
      </div>
    </>
  );
}

function NoPost() {
  return (
    <>
      <div className={usercss.category}>
        <p>POSTS</p>
      </div>
      <div className={usercss.noPost}>
        <IoCameraOutline />
        <label>No Posts Yet</label>
      </div>
    </>
  );
}

function Post({ url, ind, userToken, postToken }) {
  return (
    <>
      <Link to={`/dashboard/post/${userToken}/${postToken}`}>
        <div className={usercss.userPost}>
          <img src={url} alt={"Post " + ind} />
        </div>
      </Link>
    </>
  );
}

export default User;
