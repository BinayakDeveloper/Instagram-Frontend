import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Styles
import postcss from "../../styles/Dashboard Styles/post.module.scss";

// Assets
import avatar from "../../assets/avatar.png";
import { FaArrowLeft } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart, FaUserFriends } from "react-icons/fa";
import { HiShare } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";

function Post({ Leftdashboard, Dashboardnav, Componentloader }) {
  const navigate = useNavigate();
  const { postusertoken, posttoken } = useParams();

  const [loaded, setLoaded] = useState(false);
  const [postUserInfo, setPostUserInfo] = useState({});
  const [token, setToken] = useState("");
  const [post, setPost] = useState({});
  const [liked, setLiked] = useState(false);
  let [likeCount, setLikeCount] = useState(0);
  const [postAccess, setPostAccess] = useState(false);
  const [issue, setIssue] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");
    setToken(token);

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
          let postUserData = (
            await axios.post("https://instameserver.vercel.app/getpostinfo", {
              authkey: process.env.REACT_APP_AUTH_KEY,
              userToken: token,
              postToken: posttoken,
              postUserToken: postusertoken,
            })
          ).data;

          if (postUserData.status) {
            setPost(postUserData.postInfo);
            setLikeCount(postUserData.postInfo.likes.length);
            setLiked(
              postUserData.postInfo.likes.includes(token) ? true : false
            );
            setPostUserInfo({
              username: postUserData.username,
              profilePic: postUserData.profilePic,
            });
            setPostAccess(postUserData.status);
            setLoaded(true);
          } else {
            setPostAccess(postUserData.status);
            setPostUserInfo({ username: postUserData.username });
            setIssue(postUserData.issue);
            setLoaded(true);
          }
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
  }, [navigate, posttoken, postusertoken]);

  async function likePost() {
    if (liked === false) {
      setLikeCount(++likeCount);
      setLiked(true);
      let likeStatus = await axios.post(
        "https://instameserver.vercel.app/likepost",
        {
          authkey: process.env.REACT_APP_AUTH_KEY,
          postToken: posttoken,
          userToken: token,
        }
      );

      if (!likeStatus.data.status) {
        toast.error(likeStatus.data.response);
      }
    }
  }

  async function dislikePost() {
    if (liked) {
      setLikeCount(--likeCount);
      setLiked(false);
      let dislikeStatus = await axios.post(
        "https://instameserver.vercel.app/dislikepost",
        {
          authkey: process.env.REACT_APP_AUTH_KEY,
          postToken: posttoken,
          userToken: token,
        }
      );

      if (!dislikeStatus.data.status) {
        toast.error(dislikeStatus.data.response);
      }
    }
  }

  async function sharePost(postData) {
    if (navigator.share) {
      await navigator.share({
        title: postData.title,
        url: postData.url,
      });
    } else {
      toast.error("Browser doesn't support share api");
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
            postAccess ? (
              <div className={postcss.postBoxContainer}>
                <div className={postcss.postBoxComponents}>
                  <div className={postcss.topComponents}>
                    <div className={postcss.topLeft}>
                      <div className={postcss.backBtn}>
                        <FaArrowLeft
                          onClick={() => {
                            window.history.back();
                          }}
                        />
                      </div>
                      <div className={postcss.userDp}>
                        <Link to={"/dashboard/search/" + postUserInfo.username}>
                          <img
                            src={
                              postUserInfo.profilePic !== ""
                                ? postUserInfo.profilePic
                                : avatar
                            }
                            alt="dp"
                          />
                        </Link>
                      </div>
                      <div className={postcss.usernameLocation}>
                        <div className={postcss.username}>
                          <Link
                            to={"/dashboard/search/" + postUserInfo.username}
                          >
                            <p>{postUserInfo.username}</p>
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
                      <img
                        src={post.postUrl}
                        alt="post"
                        onDoubleClick={() => {
                          if (liked) dislikePost();
                          else likePost();
                        }}
                      />
                    </div>
                  </div>
                  <div className={postcss.bottomComponents}>
                    <div className={postcss.likebtn}>
                      <FaRegHeart
                        className={liked ? postcss.hideLike : postcss.showLike}
                        onClick={() => {
                          likePost();
                        }}
                      />
                      <FaHeart
                        className={liked ? postcss.showLike : postcss.hideLike}
                        onClick={() => {
                          dislikePost();
                        }}
                      />
                    </div>
                    <div className={postcss.sharebtn}>
                      <HiShare
                        onClick={() => {
                          const postData = {
                            title: (
                              postUserInfo.username + " Post"
                            ).toUpperCase(),
                            url: window.location.href,
                          };
                          sharePost(postData);
                        }}
                      />
                    </div>
                  </div>

                  <div className={postcss.otherDetails}>
                    <div className={postcss.likeCounter}>
                      <label>{likeCount} likes</label>
                    </div>

                    <div className={postcss.captionArea}>
                      <p>{postUserInfo.username}</p>
                      <label>{post.caption}</label>
                    </div>
                  </div>
                </div>
              </div>
            ) : issue === "follow" ? (
              <div className={postcss.postUserPrivate}>
                <FaUserFriends />
                <h2>Follow @{postUserInfo.username} to see the post</h2>
              </div>
            ) : issue === "invalid post link" ? (
              <div style={warningStyle}>
                <IoWarningOutline style={{ fontSize: "2rem" }} />
                <h3>Invalid Post</h3>
              </div>
            ) : (
              <div style={warningStyle}>
                <IoWarningOutline style={{ fontSize: "2rem" }} />
                <h3>Unknown Error Occured</h3>
              </div>
            )
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

const warningStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  marginTop: "30px",
};

export default Post;
