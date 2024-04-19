import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Styles
import regcss from "../styles/register.module.scss";

// Images
import igtext from "../assets/igtext.png";
import playstore from "../assets/playstore.png";
import microsoft from "../assets/microsoft.png";

// Components
import Pageloader from "./Pageloader";

function Register() {
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
        }
      }
      tokenValidate();
    } else {
      setTimeout(() => {
        setLoaded(true);
      }, 1500);
    }
  }, [navigate]);

  async function registerValidate(e) {
    e.preventDefault();
    let number = e.target[0].value;
    let email = e.target[1].value;
    let name = e.target[2].value;
    let username = e.target[3].value;
    let password = e.target[4].value;

    if (username.includes(" ")) {
      toast.error("Username cannot contain space");
    } else {
      e.target[5].textContent = "Signing up...";
      let userObj = {
        authkey: process.env.REACT_APP_AUTH_KEY,
        number,
        email,
        name,
        username,
        password,
      };

      let validate = (
        await axios.post(
          "https://instameserver.vercel.app/genusertoken",
          userObj
        )
      ).data;

      if (validate.status) {
        navigate(`/otp/${validate.userToken}`);
      } else {
        toast.error(validate.response);
      }

      e.target[5].textContent = "Sign up";
    }
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />

      {loaded ? (
        <div className={regcss.registerContainer}>
          <div className={regcss.registerComponents}>
            <div className={regcss.firstComponent}>
              <div className={regcss.igtext}>
                <img src={igtext} alt="igtext" />
                <p>Sign up to see photos and videos from your friends.</p>
              </div>

              <div className={regcss.line}></div>

              <div className={regcss.input}>
                <form method="post" onSubmit={registerValidate}>
                  <input
                    type="text"
                    placeholder="Mobile number"
                    name="Number"
                    autoComplete="off"
                    spellCheck="false"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    name="Email"
                    autoComplete="on"
                    spellCheck="false"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="Name"
                    spellCheck="false"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    name="Username"
                    spellCheck="false"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    name="Password"
                    spellCheck="false"
                    required
                  />
                  <p>
                    People who use our service may have uploaded your contact
                    information to Instagram
                  </p>
                  <p>
                    By signing up, you agree to our Terms , Privacy Policy and
                    Cookies Policy
                  </p>
                  <button type="submit">Sign up</button>
                </form>
              </div>
            </div>

            <div className={regcss.signin}>
              <p>Have an account?</p>
              <Link to={"/"}>Log in</Link>
            </div>

            <div className={regcss.downloadLinks}>
              <p>Get the app.</p>
              <div className={regcss.appLinks}>
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
      ) : (
        <Pageloader />
      )}
    </>
  );
}

export default Register;
