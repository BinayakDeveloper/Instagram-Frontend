import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Style
import editcss from "../../styles/Dashboard Styles/editcss.module.scss";

// Assets
import userAvatar from "../../assets/avatar.png";
import { FaChevronLeft } from "react-icons/fa";

function Editprofile({ Leftdashboard, Dashboardnav, Componentloader }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [update, setUpdate] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dpPopup, setDpPopup] = useState(false);

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
          setUserData(userData.userInfo);
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
  }, [navigate, update]);

  async function userInfoValidate(e) {
    e.preventDefault();
    setUpdate(false);
    e.target[4].textContent = "Submitting...";
    let token = localStorage.getItem("user-ssid-token-ig");
    let name = e.target[0].value;
    let username = e.target[1].value;
    let bio = e.target[2].value;

    let privateStatus = e.target[3].value;

    let updateStatus = (
      await axios.post("https://instameserver.vercel.app/updateuserinfo", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        usertoken: token,
        name,
        username,
        bio,
        privateStatus,
      })
    ).data;

    if (updateStatus.status) {
      toast.success(updateStatus.response);
      setUpdate(true);
    } else {
      toast.error(updateStatus.response);
    }
    e.target[4].textContent = "Submit";
  }

  // Upload DP

  async function uploadDp(e) {
    e.preventDefault();
    setUpdate(false);
    let uploadLabel = document.querySelector("#uploadLabel");
    let token = localStorage.getItem("user-ssid-token-ig");
    let image = e.target.files[0];

    uploadLabel.textContent = "Uploading...";
    uploadLabel.style.pointerEvents = "none";

    let uploadResponse = (
      await axios.post(
        "https://instameserver.vercel.app/uploaddp",
        {
          authkey: process.env.REACT_APP_AUTH_KEY,
          userimage: image,
          token,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
    ).data;

    if (uploadResponse.status) {
      toast.success(uploadResponse.response);
      setUpdate(true);
    } else {
      toast.error(uploadResponse.response);
      setUpdate(true);
    }
    uploadLabel.textContent = "Upload photo";
    uploadLabel.style.pointerEvents = "auto";
  }

  // Remove Dp

  async function removeDp(e) {
    setUpdate(false);
    let token = localStorage.getItem("user-ssid-token-ig");

    if (token !== null) {
      e.target.textContent = "Removing...";
      e.target.style.pointerEvents = "none";
      let removeStatus = (
        await axios.post("https://instameserver.vercel.app/removedp", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          token,
        })
      ).data;

      if (removeStatus.status) {
        toast.success(removeStatus.response);
        setUpdate(true);
      } else {
        toast.error(removeStatus.response);
        setUpdate(true);
      }
      e.target.textContent = "Remove current photo";
      e.target.style.pointerEvents = "auto";
    }
  }

  // Log Out

  function handleLogOut() {
    localStorage.removeItem("user-ssid-token-ig");
    navigate("/");
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
            !dpPopup ? (
              <Edit
                profilePic={userData.profilePic}
                username={userData.username}
                name={userData.name}
                bio={userData.bio}
                userInfoValidate={userInfoValidate}
                dpPopup={dpPopup}
                setDpPopup={setDpPopup}
                privateStatus={userData.privateStatus}
                handleLogOut={handleLogOut}
              />
            ) : (
              <ChangePhoto
                uploadDp={uploadDp}
                removeDp={removeDp}
                setDpPopup={setDpPopup}
              />
            )
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

function Edit({
  profilePic,
  username,
  name,
  bio,
  userInfoValidate,
  dpPopup,
  setDpPopup,
  privateStatus,
  handleLogOut,
}) {
  return (
    <>
      <div className={editcss.editContainer}>
        <div className={editcss.editComponents}>
          <div className={editcss.heading}>
            <FaChevronLeft
              onClick={() => {
                window.history.back();
              }}
            />
            <p>Edit profile</p>
          </div>

          <div className={editcss.changeDp}>
            <div className={editcss.leftComponent}>
              <div className={editcss.oldPic}>
                {profilePic === "" ? (
                  <img src={userAvatar} alt="avatar" />
                ) : (
                  <img src={profilePic} alt="avatar" />
                )}
              </div>
              <div className={editcss.userInfo}>
                <p>{username}</p>
                <p>{name}</p>
              </div>
            </div>
            <div className={editcss.rightComponent}>
              <button
                onClick={() => {
                  setDpPopup(!dpPopup);
                }}
              >
                Change photo
              </button>
            </div>
          </div>

          <div className={editcss.changeUserInfo}>
            <form method="post" onSubmit={userInfoValidate}>
              <div className={editcss.changeName}>
                <p>Name</p>
                <input
                  type="text"
                  name="name"
                  defaultValue={name}
                  spellCheck="false"
                  autoComplete="off"
                />
                <div className={editcss.nameHeading}></div>
                <div className={editcss.nameInp}></div>
              </div>

              <div className={editcss.changeUserName}>
                <p>Username</p>
                <input
                  type="text"
                  name="username"
                  defaultValue={username}
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>

              <div className={editcss.changeBio}>
                <p>Bio</p>
                <textarea
                  name="bio"
                  maxLength={150}
                  spellCheck="false"
                  autoComplete="off"
                  defaultValue={bio}
                ></textarea>
              </div>

              <div className={editcss.privateStatus}>
                <p>Private account</p>
                <input
                  type="range"
                  name="private"
                  max={1}
                  defaultValue={privateStatus}
                />
              </div>

              <div className={editcss.submitBtn}>
                <button type="submit">Submit</button>
              </div>

              <div className={editcss.logOutBtn} onClick={handleLogOut}>
                <label>Logout</label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function ChangePhoto({ uploadDp, removeDp, setDpPopup }) {
  return (
    <>
      <div className={editcss.changeDpContainer}>
        <div className={editcss.dpComponents}>
          <div className={editcss.dpHeading}>
            <p>Change profile photo</p>
          </div>
          <div className={editcss.changingOptions}>
            <div className={editcss.uploadDp}>
              <form method="post" encType="multipart/form-data">
                <input
                  type="file"
                  name="userdp"
                  id="image"
                  onChange={uploadDp}
                  accept=".jpg"
                />
                <label htmlFor="image" id="uploadLabel">
                  Upload photo
                </label>
              </form>
            </div>
            <div className={editcss.removeDp} onClick={removeDp}>
              <p>Remove current photo</p>
            </div>
            <div
              className={editcss.cancel}
              onClick={() => {
                setDpPopup(false);
              }}
            >
              <p>Cancel</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Editprofile;
