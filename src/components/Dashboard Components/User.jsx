import axios from "axios";
import { useState, useEffect } from "react";
import { /*Link,*/ useNavigate, useParams } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

// Components
import Pnf from "../Pnf";

function User() {
  const navigate = useNavigate();
  const { username } = useParams();

  const [validPage, setValidPage] = useState(false);
  const [userData, setUserData] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");

    if (token === null) {
      navigate("/");
    } else {
      async function getSearchedUserData() {
        let userData = (
          await axios.post("http://localhost:500/getsearchuserinfo", {
            authkey: process.env.REACT_APP_AUTH_KEY,
            usertoken: token,
            username,
          })
        ).data;

        if (userData.status) {
          setUserData(userData.searchedUserInfo);

          setValidPage(true);
        } else {
          setValidPage(false);
        }
        setLoaded(true);
      }
      getSearchedUserData();
    }
  }, [navigate, setUserData, username]);

  return (
    <>
      {loaded ? (
        validPage ? (
          <>{/* Searched User Component */}</>
        ) : (
          <Pnf />
        )
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}

export default User;
