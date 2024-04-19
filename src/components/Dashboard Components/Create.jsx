import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// Styles
import createcss from "../../styles/Dashboard Styles/createpost.module.scss";

// Assets
import imgvid from "../../assets/imgvidcombine.png";
import { FaArrowLeft } from "react-icons/fa";
import avatar from "../../assets/avatar.png";
import { HiOutlineMapPin } from "react-icons/hi2";

function Create({ Leftdashboard, Dashboardnav, Componentloader }) {
  const navigate = useNavigate();

  // stages = ["imageselection", "previewimage", "imagecaption","imageuploading"];
  let [pointer, setPointer] = useState(0);
  let [captionLen, setCaptionLen] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [file, setFile] = useState({});
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

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
          setLoaded(true);
          setUserInfo(userData.userInfo);
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

  async function uploadPost(e) {
    e.preventDefault();
    let imgData = e.target.files[0];
    if (imgData.size > 4000000) {
      toast.error("File size too large");
    } else {
      setFile(imgData);
      let imgUrl = URL.createObjectURL(imgData);
      setPreviewUrl(imgUrl);
      setPointer(++pointer);
    }
  }

  async function sharePost() {
    setPointer(++pointer);
    let finalData = {
      userpost: file,
      caption,
      location,
      userToken: userInfo.token,
    };

    let uploadStatus = (
      await axios.post(
        "https://instameserver.vercel.app/uploadpost",
        finalData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
    ).data;

    if (uploadStatus.status) {
      toast.success(uploadStatus.response);
      setPointer(0);
    } else {
      toast.error(uploadStatus.response);
      setPointer(0);
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
            <div className={createcss.createContainer}>
              <div className={createcss.createComponents}>
                <div className={createcss.heading}>
                  {pointer !== 0 ? (
                    <FaArrowLeft
                      onClick={() => {
                        setPointer(--pointer);
                      }}
                    />
                  ) : (
                    <div />
                  )}
                  <p>Create new post</p>
                  {pointer !== 0 ? (
                    pointer === 2 ? (
                      <label onClick={sharePost}>Share</label>
                    ) : (
                      <label
                        onClick={() => {
                          setPointer(++pointer);
                        }}
                      >
                        Next
                      </label>
                    )
                  ) : (
                    <div />
                  )}
                </div>

                {pointer === 0 ? (
                  <div className={createcss.uploadArea}>
                    <div className={createcss.demoImg}>
                      <img src={imgvid} alt="imgvid" />
                    </div>

                    <div className={createcss.labelArea}>
                      <label>Select photos here</label>
                      <label htmlFor="userpost">Select from computer</label>
                    </div>

                    <form method="post" encType="multipart/form-data">
                      <input
                        type="file"
                        name="userpost"
                        id="userpost"
                        accept=".jpg,.png"
                        onChange={uploadPost}
                      />
                    </form>
                  </div>
                ) : pointer === 1 ? (
                  <div className={createcss.previewImg}>
                    <img src={previewUrl} alt="previewImg" />
                  </div>
                ) : pointer === 2 ? (
                  <>
                    <div className={createcss.captionContainer}>
                      <div className={createcss.previewImg2}>
                        <img src={previewUrl} alt="previewImg2" />
                      </div>

                      <div className={createcss.captionArea}>
                        <div className={createcss.userInfo}>
                          <div className={createcss.userdp}>
                            {userInfo.profilePic !== "" ? (
                              <img src={userInfo.profilePic} alt="userdp" />
                            ) : (
                              <img src={avatar} alt="userdp" />
                            )}
                          </div>
                          <div className={createcss.username}>
                            <p>{userInfo.username}</p>
                          </div>
                        </div>
                        <textarea
                          name="caption"
                          id="caption"
                          placeholder="Write a caption..."
                          spellCheck="false"
                          autoComplete="off"
                          maxLength={300}
                          defaultValue={""}
                          onChange={(e) => {
                            setCaptionLen(e.target.value.length);
                            setCaption(e.target.value.trim());
                          }}
                        ></textarea>

                        <p
                          style={{
                            textAlign: "end",
                            width: "100%",
                            opacity: "0.6",
                            fontSize: "13px",
                            fontWeight: "200",
                          }}
                        >
                          {captionLen}/300
                        </p>

                        <div className={createcss.locationInp}>
                          <input
                            type="text"
                            defaultValue={""}
                            placeholder="Add location"
                            onChange={(e) => {
                              setLocation(e.target.value.trim());
                            }}
                          />
                          <HiOutlineMapPin />
                        </div>
                      </div>
                    </div>
                  </>
                ) : pointer === 3 ? (
                  <div className={createcss.uploadingStatus}>
                    <div className={createcss.uploadLoader}></div>
                    <p>Uploading...</p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

export default Create;
