import axios from "axios";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");
    setUserToken(token);

    async function getNotifications() {
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
        setFollowRequests(notifications.response.followRequests);
        setNotifications(notifications.response.notifications);
      } else {
        toast.error(notifications.response);
        localStorage.removeItem("user-ssid-token-ig");
        navigate("/");
      }
      setLoaded(true);
    }

    getNotifications();
  }, [navigate]);

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
                <p></p>
                {followRequests.length !== 0 ? (
                  <>
                    <p>New requests</p>
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
                            navigate={navigate}
                          />
                        );
                      }
                    )}
                  </>
                ) : null}

                {notifications.length === 0 ? (
                  <div className={notificationcss.noNotification}>
                    <IoMdNotificationsOff />
                    <h2>No Notification</h2>
                  </div>
                ) : (
                  notifications.map((notification, ind) => {
                    return <h2 key={ind}>{notification.type}</h2>;
                  })
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

function Request({
  profilePic,
  name,
  username,
  token,
  userToken,
  setUserData,
  setFollowRequests,
  setNotifications,
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
