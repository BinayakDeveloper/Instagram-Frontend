import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Styles
import sharecss from "../../styles/Dashboard Styles/shareprofile.module.scss";

function Shareprofile({ Leftdashboard, Dashboardnav, Componentloader }) {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    async function getQR() {
      let token = localStorage.getItem("user-ssid-token-ig");
      let qrData = await axios.post(
        "https://instameserver.vercel.app/generateuserqr",
        {
          authkey: process.env.REACT_APP_AUTH_KEY,
          usertoken: token,
        }
      );

      if (qrData.data.status) {
        setUrl(qrData.data.qrLink);
        setUsername(qrData.data.username);
      } else {
        localStorage.removeItem("user-ssid-token-ig");
        toast.error(qrData.data.response);
        navigate("/");
      }

      setLoaded(true);
    }
    getQR();
  }, [navigate]);

  function downloadQR() {
    let img = document.createElement("a");
    img.href = url;
    img.download = username + "-" + Date.now();
    img.click();
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
            <>
              <div className={sharecss.shareContainer}>
                <div className={sharecss.shareComponents}>
                  <div className={sharecss.leftComponents}>
                    <div className={sharecss.qrImg}>
                      <img src={url} alt="qrurl" />
                    </div>
                    <div className={sharecss.username}>
                      <p>@{username}</p>
                    </div>
                  </div>
                  <div className={sharecss.rightComponents}>
                    <div className={sharecss.top}>
                      <p>QR code helps people follow you quickly</p>
                    </div>
                    <div className={sharecss.bottom}>
                      <p>
                        People can scan your QR code with their smartphone’s
                        camera to see your profile. Download and print your QR
                        code, then stick it on your products, posters and more.
                      </p>
                      <button onClick={downloadQR}>Download QR code</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Componentloader />
          )}
        </div>
      </div>
    </>
  );
}

export default Shareprofile;
