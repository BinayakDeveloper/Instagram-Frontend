import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Style
import searchcss from "../../styles/Dashboard Styles/search.module.scss";

// Assets
import avatar from "../../assets/avatar.png";
import { FaChevronLeft } from "react-icons/fa";

function Search({ Leftdashboard, Dashboardnav, Componentloader, Userloader }) {
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchUserloaded, setSearchUserLoaded] = useState(true);
  const [noUserText, setNoUserText] = useState("");

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
  }, [token, navigate]);

  let timeout;

  function searchUser(e) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      setSearchUserLoaded(false);

      let inputValue = e.target.value;

      if (inputValue !== "") {
        async function getUser() {
          let users = (
            await axios.post("https://instameserver.vercel.app/searchuser", {
              authkey: process.env.REACT_APP_AUTH_KEY,
              username: inputValue,
              token,
            })
          ).data;

          setSearchUserLoaded(true);

          if (users.status) {
            setUsers(users.users);
          } else {
            setUsers([]);
            setNoUserText(users.response);
          }
        }
        getUser();
      } else {
        setSearchUserLoaded(true);
        setUsers([]);
        setNoUserText("");
      }
    }, 300);
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
            <Searchuser
              users={users}
              searchUser={searchUser}
              noUserText={noUserText}
              searchUserloaded={searchUserloaded}
              Userloader={Userloader}
            />
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

function Searchuser({
  users,
  searchUser,
  noUserText,
  searchUserloaded,
  Userloader,
}) {
  return (
    <>
      <div className={searchcss.searchcontainer}>
        <div className={searchcss.searchcomponents}>
          <div className={searchcss.searchheading}>
            <FaChevronLeft
              onClick={() => {
                window.history.back();
              }}
            />
            <p>Search</p>
          </div>

          <div className={searchcss.input}>
            <input
              type="text"
              placeholder="Search"
              name="username input"
              spellCheck="false"
              autoComplete="off"
              onKeyUp={searchUser}
            />
          </div>

          <div className={searchcss.users}>
            {searchUserloaded ? (
              users.length !== 0 ? (
                users.map((user, ind) => {
                  return (
                    <User
                      key={ind}
                      username={user.username}
                      name={user.name}
                      profilePic={user.profilePic}
                      followers={user.followers}
                    />
                  );
                })
              ) : (
                <h1>{noUserText}</h1>
              )
            ) : (
              <Userloader />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function User({ username, name, profilePic, followers }) {
  return (
    <>
      <Link to={`/dashboard/search/${username}`}>
        <div className={searchcss.userContainer}>
          <div className={searchcss.userComponents}>
            <div className={searchcss.profilePic}>
              {profilePic === "" ? (
                <img src={avatar} alt="avatar" />
              ) : (
                <img src={profilePic} alt="userdp" />
              )}
            </div>
            <div className={searchcss.userInfo}>
              <p>{username}</p>
              <p>
                {name} •{" "}
                {followers > 9999 && followers < 999999
                  ? Math.floor(followers / 1000) + "K"
                  : followers > 999999 && followers < 999999999
                  ? Math.floor(followers / 1000000) + "M"
                  : followers > 999999999
                  ? Math.floor(followers / 1000000000) + "B"
                  : followers}{" "}
                followers
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Search;
