import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

// Styles
import notificationcss from "../../styles/Dashboard Styles/notification.module.scss";

// Assets
import avatar from "../../assets/avatar.png";
import { IoMdClose } from "react-icons/io";
import { IoMdNotificationsOff } from "react-icons/io";

function Notification({ Leftdashboard, Dashboardnav, Componentloader }) {
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [followRequests, setFollowRequests] = useState([]);
  const [userData, setUserData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationUserData, setNotificationUserData] = useState([]);

  const getNotifications = useCallback(
    async (token) => {
      let notifications = (
        await axios.post("https://instameserver.vercel.app/getnotifications", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: token,
        })
      ).data;

      if (notifications.status) {
        let followRequestsList = notifications.response.followRequests;
        if (followRequestsList.length !== 0) {
          let usersResponse = (
            await axios.post(
              "https://instameserver.vercel.app/getbulkuserdata",
              {
                authkey: process.env.REACT_APP_AUTH_KEY,
                tokenList: followRequestsList,
              }
            )
          ).data;

          setUserData(usersResponse.users);
        }

        let notificationData = notifications.response.notifications;
        let notificationTokens = [];
        Array.from(notificationData).forEach((data) => {
          notificationTokens.push(data.friendToken);
        });

        let notificationUserData = await axios.post(
          "https://instameserver.vercel.app/getbulkuserdata",
          {
            authkey: process.env.REACT_APP_AUTH_KEY,
            tokenList: notificationTokens,
          }
        );

        setNotificationUserData(notificationUserData.data.users);
        setFollowRequests(notifications.response.followRequests);
        setNotifications(notifications.response.notifications);
      } else {
        toast.error(notifications.response);
        localStorage.removeItem("user-ssid-token-ig");
        navigate("/");
      }
      setLoaded(true);
    },
    [navigate]
  );

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");
    getNotifications(token);
    setUserToken(token);
  }, [setUserToken, getNotifications]);

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
              <div className={notificationcss.notificationContainer}>
                {followRequests.length !== 0 ? (
                  <>
                    <p>Follow requests</p>
                    {userData.map(
                      ({ profilePic, name, username, token }, ind) => {
                        return (
                          <Request
                            key={ind}
                            profilePic={profilePic}
                            name={name}
                            username={username}
                            token={token}
                            userToken={userToken}
                            setUserData={setUserData}
                            setFollowRequests={setFollowRequests}
                            setNotifications={setNotifications}
                            setNotificationUserData={setNotificationUserData}
                            navigate={navigate}
                          />
                        );
                      }
                    )}
                  </>
                ) : null}
                {notifications.length === 0 &&
                notificationUserData.length === 0 &&
                followRequests.length === 0 ? (
                  <div className={notificationcss.noNotification}>
                    <IoMdNotificationsOff />
                    <h2>No Notification</h2>
                  </div>
                ) : (
                  <>
                    {notifications.length !== 0 &&
                    notificationUserData.length !== 0 ? (
                      <div className={notificationcss.notificationHeading}>
                        <h2>Notifications</h2>
                      </div>
                    ) : null}
                    {notificationUserData.map((data, ind) => {
                      return notifications[ind].type === "follow" ? (
                        <FollowNotificationContent
                          data={data}
                          userToken={userToken}
                          key={ind}
                          getNotifications={getNotifications}
                        />
                      ) : (
                        ""
                      );
                    })}
                  </>
                )}
              </div>
            </>
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

function FollowNotificationContent({ data, userToken, getNotifications }) {
  async function followUser(e, userToken, friendData) {
    e.target.style.pointerEvents = "none";
    e.target.textContent = "Requesting...";

    let followStatus = (
      await axios.post("https://instameserver.vercel.app/followuser", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: friendData.token,
      })
    ).data;
    if (followStatus.status) {
      getNotifications(userToken);
    } else {
      toast.error("Unknown Error Occured");
      getNotifications(userToken);
    }
    e.target.style.pointerEvents = "auto";
  }

  async function unFollowUser(e, userToken, friendData) {
    e.target.style.pointerEvents = "none";
    e.target.textContent = "Requesting...";

    let unFollowStatus = (
      await axios.post("https://instameserver.vercel.app/unfollowuser", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: friendData.token,
      })
    ).data;
    if (unFollowStatus.status) {
      getNotifications(userToken);
    } else {
      toast.error("Unknown Error Occured");
      getNotifications(userToken);
    }
    e.target.style.pointerEvents = "auto";
  }

  async function removeRequest(e, userToken, friendData) {
    e.target.style.pointerEvents = "none";
    e.target.textContent = "Requesting...";

    let removeStatus = (
      await axios.post("https://instameserver.vercel.app/removefollowrequest", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: friendData.token,
      })
    ).data;

    if (removeStatus.status) {
      getNotifications(userToken);
    } else {
      toast.error("Unknown Error Occured");
      getNotifications(userToken);
    }
    e.target.style.pointerEvents = "auto";
  }

  return (
    <>
      <div className={notificationcss.followContainer}>
        <div className={notificationcss.followUserInfo}>
          <Link to={`/dashboard/search/${data.username}`}>
            <div className={notificationcss.followUserLeft}>
              <div className={notificationcss.followUserImg}>
                {data.profilePic !== "" ? (
                  <img src={data.profilePic} alt="userdp" />
                ) : (
                  <img src={avatar} alt="avatar" />
                )}
              </div>
              <div className={notificationcss.followMessage}>
                <p>
                  <b>{data.username}</b> started following you.{" "}
                </p>
              </div>
            </div>
          </Link>
          <div className={notificationcss.followUserRight}>
            <div className={notificationcss.followButton}>
              {data.followers.includes(userToken) ? (
                <button
                  className={notificationcss.followingBtn}
                  onClick={(e) => {
                    unFollowUser(e, userToken, data);
                  }}
                >
                  Following
                </button>
              ) : data.followRequests.includes(userToken) ? (
                <button
                  className={notificationcss.requestSentBtn}
                  onClick={(e) => {
                    removeRequest(e, userToken, data);
                  }}
                >
                  Request sent
                </button>
              ) : (
                <button
                  className={notificationcss.followBackBtn}
                  onClick={(e) => {
                    followUser(e, userToken, data);
                  }}
                >
                  Follow Back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Request({
  profilePic,
  name,
  username,
  token,
  userToken,
  setUserData,
  setFollowRequests,
  setNotifications,
  setNotificationUserData,
  navigate,
}) {
  async function cancelRequest(e) {
    let removeStatus = (
      await axios.post("https://instameserver.vercel.app/declinerequest", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: token,
      })
    ).data;

    if (removeStatus.status) {
      let notifications = (
        await axios.post("https://instameserver.vercel.app/getnotifications", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: userToken,
        })
      ).data;

      if (notifications.status) {
        let followRequestsList = notifications.response.followRequests;
        if (followRequestsList.length !== 0) {
          let usersResponse = (
            await axios.post(
              "https://instameserver.vercel.app/getbulkuserdata",
              {
                authkey: process.env.REACT_APP_AUTH_KEY,
                tokenList: followRequestsList,
              }
            )
          ).data;

          setUserData(usersResponse.users);
        }

        let notificationData = notifications.response.notifications;
        let notificationTokens = [];
        Array.from(notificationData).forEach((data) => {
          notificationTokens.push(data.friendToken);
        });

        let notificationUserData = await axios.post(
          "https://instameserver.vercel.app/getbulkuserdata",
          {
            authkey: process.env.REACT_APP_AUTH_KEY,
            tokenList: notificationTokens,
          }
        );

        setNotificationUserData(notificationUserData.data.users);
        setFollowRequests(notifications.response.followRequests);
        setNotifications(notifications.response.notifications);
      } else {
        toast.error(notifications.response);
        localStorage.removeItem("user-ssid-token-ig");
        navigate("/");
      }
    } else {
      toast.error(removeStatus.data.response);
    }
  }

  async function acceptRequest(e) {
    e.target.textContent = "Requesting...";
    e.target.style.pointerEvents = "none";
    let acceptStatus = (
      await axios.post("https://instameserver.vercel.app/acceptrequest", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: userToken,
        friendtoken: token,
      })
    ).data;

    if (acceptStatus.status) {
      let notifications = (
        await axios.post("https://instameserver.vercel.app/getnotifications", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: userToken,
        })
      ).data;

      if (notifications.status) {
        let followRequestsList = notifications.response.followRequests;
        if (followRequestsList.length !== 0) {
          let usersResponse = (
            await axios.post(
              "https://instameserver.vercel.app/getbulkuserdata",
              {
                authkey: process.env.REACT_APP_AUTH_KEY,
                tokenList: followRequestsList,
              }
            )
          ).data;

          setUserData(usersResponse.users);
        }

        let notificationData = notifications.response.notifications;
        let notificationTokens = [];
        Array.from(notificationData).forEach((data) => {
          notificationTokens.push(data.friendToken);
        });

        let notificationUserData = await axios.post(
          "https://instameserver.vercel.app/getbulkuserdata",
          {
            authkey: process.env.REACT_APP_AUTH_KEY,
            tokenList: notificationTokens,
          }
        );

        setNotificationUserData(notificationUserData.data.users);
        setFollowRequests(notifications.response.followRequests);
        setNotifications(notifications.response.notifications);
      } else {
        toast.error(notifications.response);
        localStorage.removeItem("user-ssid-token-ig");
        navigate("/");
      }
    } else {
      toast.error(acceptStatus.data.response);
    }

    e.target.style.pointerEvents = "auto";
    e.target.textContent = "Confirm";
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />
      <div className={notificationcss.reqContainer}>
        <div className={notificationcss.reqComponents}>
          <Link to={`/dashboard/search/${username}`}>
            <div className={notificationcss.leftComponents}>
              <div className={notificationcss.profilePic}>
                {profilePic === "" ? (
                  <img src={avatar} alt="avatar" />
                ) : (
                  <img src={profilePic} alt="pic" />
                )}
              </div>
              <div className={notificationcss.userInfo}>
                <p>{username}</p>
                <p>{name}</p>
              </div>
            </div>
          </Link>

          <div className={notificationcss.rightComponents}>
            <button onClick={acceptRequest}>Confirm</button>
            <IoMdClose onClick={cancelRequest} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Notification;
