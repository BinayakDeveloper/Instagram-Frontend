import axios from "axios";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// Style
import forgotcss from "../styles/forgot.module.scss";

// Images
import igtext from "../assets/igtext.png";
import lock from "../assets/lock.png";

function Forgot() {
  const navigate = useNavigate();

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
        } else {
          navigate("/dashboard");
        }
      }
      tokenValidate();
    }
  }, [navigate]);

  async function forgotValidate(e) {
    e.preventDefault();
    e.target[1].textContent = "Sending...";

    let forotResponse = (
      await axios.post("https://instameserver.vercel.app/genforgottoken", {
        authkey: process.env.REACT_APP_AUTH_KEY,
        data: e.target[0].value,
      })
    ).data;

    if (forotResponse.status) {
      toast.success(forotResponse.response);
    } else {
      toast.error(forotResponse.response);
    }

    e.target[1].textContent = "Send reset link";
  }

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{ fontWeight: "bold", letterSpacing: "0.8px" }}
      />

      <nav className={forgotcss.nav}>
        <Link to={"/"}>
          <img src={igtext} alt="igtext" />
        </Link>
      </nav>

      <div className={forgotcss.forgotContainer}>
        <div className={forgotcss.forgotComponents}>
          <div className={forgotcss.forgotCredentials}>
            <div className={forgotcss.image}>
              <img src={lock} alt="lock" />
            </div>
            <p style={{ fontWeight: "bold" }}>Trouble logging in?</p>
            <p style={{ textAlign: "center" }}>
              Enter your email, phone, or username and we'll send you a link to
              get back into your account.
            </p>
            <div className={forgotcss.input}>
              <form method="post" onSubmit={forgotValidate}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email, Phone, or Username"
                  required
                />
                <button type="submit">Send reset link</button>
              </form>
            </div>
            <div className={forgotcss.or}>
              <div className={forgotcss.line1}></div>
              <p>or</p>
              <div className={forgotcss.line2}></div>
            </div>

            <div className={forgotcss.createAcc}>
              <Link to={"/register"}>Create new account</Link>
            </div>
          </div>

          <div className={forgotcss.login}>
            <Link to={"/"}>Back to login</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Forgot;
