import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Pnf from "./Pnf.jsx";

// Styles
import otpcss from "../styles/otp.module.scss";

// Images
import lockImg from "../assets/lock.png";
import playstore from "../assets/playstore.png";
import microsoft from "../assets/microsoft.png";
import mail from "../assets/mail.png";

function Otp() {
  const navigate = useNavigate();
  let { usertoken } = useParams();
  const [validPage, setValidPage] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    async function getUserInfo() {
      let user = (
        await axios.post("https://instameserver.vercel.app/verifyusertoken", {
          authkey: process.env.REACT_APP_AUTH_KEY,
          token: usertoken,
        })
      ).data;

      if (user.status) {
        console.log(user);
        setUserInfo(user.userInfo);
        let otp = await axios.post(
          "https://instameserver.vercel.app/genotptoken",
          {
            authkey: process.env.REACT_APP_AUTH_KEY,
            userInfo: user.userInfo,
          }
        );

        if (otp.data.status) {
          setOtpToken(otp.data.otpToken);
          setLoaded(true);
        }
      } else {
        setValidPage(false);
        setLoaded(true);
      }
    }

    getUserInfo();
  }, [usertoken]);

  async function otpValidate(e) {
    e.preventDefault();
    let enteredOtp = e.target[0].value;

    let validateResponse = (
      await axios.post("https://instameserver.vercel.app/verifyotptoken", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        enteredOtp,
        otpToken,
      })
    ).data;

    if (validateResponse.status) {
      toast.success(validateResponse.response);
      document.querySelector("input").style.pointerEvents = "none";
      document.querySelector("button").style.pointerEvents = "none";
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    } else {
      toast.error(validateResponse.response);
      setTimeout(() => {
        if (validateResponse.response.toLowerCase() === "already registered") {
          navigate("/register");
        }
      }, 1000);
    }
  }

  async function resendOtp(e) {
    e.target.innerHTML = "sending otp...";
    let otp = await axios.post("https://instameserver.vercel.app/genotptoken", {
      authkey: process.env.REACT_APP_AUTH_KEY,
      userInfo: userInfo,
    });

    if (otp.data.status) {
      setOtpToken(otp.data.otpToken);
      toast.success(otp.data.response);
    } else {
      toast.error(otp.data.response);
    }

    e.target.innerHTML = "resend it.";
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />
      {loaded ? (
        validPage ? (
          <div className={otpcss.otpcontainer}>
            <div className={otpcss.otpcomponents}>
              <div className={otpcss.lockimg}>
                <img src={lockImg} alt="lock" />
              </div>
              <div className={otpcss.otptext}>
                <p>Enter the code we sent to your mail</p>
              </div>

              <div className={otpcss.otpinp}>
                <form method="post" onSubmit={otpValidate}>
                  <input
                    type="number"
                    placeholder="Security Code"
                    name="security code"
                    required
                  />
                  <button type="submit">Confirm</button>
                </form>
              </div>

              <div className={otpcss.resend}>
                <p>Didn't get a security code? We can</p>
                <button onClick={resendOtp}>resend it</button>
              </div>
            </div>

            <div className={otpcss.downloadLinks}>
              <p>Get the app.</p>
              <div className={otpcss.appLinks}>
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
        ) : (
          <>
            <Pnf />
          </>
        )
      ) : (
        <>
          <div className={otpcss.sendingMailContainer}>
            <div className={otpcss.mailComponents}>
              <img src={mail} alt="mail" />
              <p>Sending verification code</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Otp;
