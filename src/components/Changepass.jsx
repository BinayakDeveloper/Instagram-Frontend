import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Components
import Pnf from "./Pnf";

// Styles
import changePassCss from "../styles/changepass.module.scss";

// Images
import lockImg from "../assets/lock.png";
import tickImg from "../assets/tick.jpg";

function Changepass() {
  const { forgottoken, usertoken } = useParams();

  const [userInfo, setUserInfo] = useState({});
  const [validPage, setValidPage] = useState(false);
  const [passChanged, setPassChanged] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function changePassValidate() {
      let userTokenValidate = await axios.post(
        "https://instameserver.vercel.app/getuserinfo",
        {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken,
        }
      );

      if (userTokenValidate.data) {
        setUserInfo(userTokenValidate.data.userInfo);

        let forgotTokenValidate = await axios.post(
          "https://instameserver.vercel.app/verifyforgottoken",
          {
            authkey: process.env.REACT_APP_AUTH_KEY,
            token: forgottoken,
            oldPass: userTokenValidate.data.userInfo.password,
          }
        );
        if (forgotTokenValidate.data.status) {
          setValidPage(true);
        } else {
          setValidPage(false);
        }
      } else {
        setValidPage(false);
      }

      setLoaded(true);
    }

    changePassValidate();
  }, [usertoken, forgottoken]);

  async function changePass(e) {
    e.preventDefault();

    e.target[2].textContent = "Submitting...";

    let newPass = e.target[0].value;
    let conPass = e.target[1].value;

    if (newPass.trim() !== conPass.trim()) {
      toast.error("Passwords Are Not Same");
    } else {
      let { data } = await axios.post(
        "https://instameserver.vercel.app/changepass",
        {
          authkey: process.env.REACT_APP_AUTH_KEY,
          forgottoken,
          newPass,
          oldPass: userInfo.password,
        }
      );

      if (data.status) {
        setUserInfo({});
        toast.success(data.response);
        setPassChanged(true);
      } else {
        toast.error(data.response);
      }
    }

    e.target[2].textContent = "Confirm";
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />
      {loaded ? (
        validPage ? (
          !passChanged ? (
            <div className={changePassCss.changePassContainer}>
              <div className={changePassCss.changePassComponents}>
                <div className={changePassCss.lockImg}>
                  <img src={lockImg} alt="lock" />
                  <p>
                    Change your password and continue exploring your friend's
                    posts
                  </p>
                </div>
                <div className={changePassCss.changeInput}>
                  <form method="post" onSubmit={changePass}>
                    <input
                      type="password"
                      name="newPass"
                      placeholder="New password"
                      required
                    />
                    <input
                      type="password"
                      name="conPass"
                      placeholder="Confirm password"
                      required
                    />
                    <button type="submit">Confirm</button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className={changePassCss.tickContainer}>
              <img src={tickImg} alt="tick" />
              <p>Password Changed</p>
              <div className={changePassCss.home}>
                <p>Go back to </p>
                <Link to={"/"}>Home</Link>
              </div>
            </div>
          )
        ) : (
          <Pnf />
        )
      ) : null}
    </>
  );
}

export default Changepass;
