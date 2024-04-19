import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// CSS FILES
import logincss from "../styles/login.module.scss";

// IMAGES
import phoneImg from "../assets/home-phones.png";
import ss from "../assets/ss.png";
import igtext from "../assets/igtext.png";
import playstore from "../assets/playstore.png";
import microsoft from "../assets/microsoft.png";

// Components
import Pageloader from "./Pageloader";

function Login() {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("user-ssid-token-ig");

    if (token !== null) {
      async function tokenValidate() {
        let tokenVerify = await axios.post(
          "https://instameserver.vercel.app/verifyusertoken",
          {
            authkey: process.env.REACT_APP_AUTH_KEY,
            token,
          }
        );
        if (!tokenVerify.data.status) {
          toast.error("Invalid token");
          localStorage.removeItem("user-ssid-token-ig");
          setLoaded(true);
        } else {
          navigate("/dashboard");
          setLoaded(false);
        }
      }
      tokenValidate();
    } else {
      setTimeout(() => {
        setLoaded(true);
      }, 1500);
    }
  }, [navigate]);

  async function loginValidate(e) {
    e.preventDefault();
    e.target[2].textContent = "Logging in...";
    let username = e.target[0].value;
    let password = e.target[1].value;

    let userObj = {
      authkey: process.env.REACT_APP_AUTH_KEY,
      username,
      password,
    };

    let loginStatus = (
      await axios.post("https://instameserver.vercel.app/login", userObj)
    ).data;

    if (loginStatus.status) {
      localStorage.setItem("user-ssid-token-ig", loginStatus.token);
      navigate("/dashboard");
    } else {
      toast.error(loginStatus.response);
    }
    e.target[2].textContent = "Log in";
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />
      {loaded ? (
        <>
          <div className={logincss.loginContainer}>
            <div className={logincss.loginLeft}>
              <div className={logincss.phoneBg}>
                <img src={phoneImg} alt="phonebg" />
              </div>
              <div className={logincss.screenshot}>
                <img src={ss} alt="ss" />
              </div>
            </div>
            <div className={logincss.loginRight}>
              <div className={logincss.rightContainer}>
                <div className={logincss.igtext}>
                  <img src={igtext} alt="igtext" />
                </div>
                <div className={logincss.input}>
                  <form method="post" onSubmit={loginValidate}>
                    <input
                      type="text"
                      name="email"
                      placeholder="Phone number, username, or email"
                      autoComplete="on"
                      spellCheck="false"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      required
                    />
                    <button type="submit">Log in</button>
                  </form>
                </div>
                <div className={logincss.line}></div>
                <div className={logincss.forgot}>
                  <Link to={"/forgot-password"}>Forgot password?</Link>
                </div>
              </div>

              <div className={logincss.signUp}>
                <p>Don't have an account?</p>
                <Link to={"/register"}>Sign up</Link>
              </div>

              <div className={logincss.downloadLinks}>
                <p>Get the app.</p>
                <div className={logincss.appLinks}>
                  <Link
                    to={
                      "https://play.google.com/store/apps/details?id=com.instagram.android"
                    }
                    target="_blank"
                  >
                    <img src={playstore} alt="playstore" />
                  </Link>
                  <Link
                    to={
                      "https://www.microsoft.com/store/productId/9NBLGGH5L9XT?ocid=pdpshare"
                    }
                    target="_blank"
                  >
                    <img src={microsoft} alt="microsoft" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Pageloader />
      )}
    </>
  );
}

export default Login;
