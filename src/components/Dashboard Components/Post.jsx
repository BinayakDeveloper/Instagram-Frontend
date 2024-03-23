import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Styles
import postcss from "../../styles/Dashboard Styles/post.module.scss";

// Assets
import avatar from "../../assets/avatar.png";

function Post({ Leftdashboard, Dashboardnav, Componentloader }) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({});

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
          setUserInfo(userData.userInfo);
          setLoaded(true);
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
          {loaded ? <Postbox userInfo={userInfo} /> : <Componentloader />}
        </div>
      </div>
    </>
  );
}

function Postbox({ userInfo }) {
  const { username, postid } = useParams();
  let postInfo = userInfo.posts;

  const post = postInfo.find((post) => {
    if (post.postToken === postid && userInfo.username === username)
      return post;
    return undefined;
  });

  return (
    <>
      {post !== undefined ? (
        <div className={postcss.postBoxContainer}>
          <div className={postcss.postBoxComponents}>
            <div className={postcss.topComponents}>
              <div className={postcss.topLeft}>
                <div className={postcss.userDp}>
                  <Link to={"/dashboard/search/" + username}>
                    <img
                      src={
                        userInfo.profilePic !== ""
                          ? userInfo.profilePic
                          : avatar
                      }
                      alt="dp"
                    />
                  </Link>
                </div>
                <div className={postcss.usernameLocation}>
                  <div className={postcss.username}>
                    <Link to={"/dashboard/search/" + username}>
                      <p>{userInfo.username}</p>
                    </Link>
                  </div>
                  <div className={postcss.location}>
                    {post.location !== "" ? <p>{post.location}</p> : null}
                  </div>
                </div>
              </div>
            </div>
            <div className={postcss.middleComponents}>
              <div className={postcss.userPost}>
                <img src={post.postUrl} alt="post" />
              </div>
            </div>
            <div className={postcss.bottomComponents}></div>
          </div>
        </div>
      ) : (
        <h3>Invalid Post</h3>
      )}
    </>
  );
}

export default Post;
