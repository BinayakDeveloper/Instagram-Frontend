import { Link } from "react-router-dom";
import pnfcss from "../styles/pnf.module.scss";
import pnfImg from "../assets/pnf.jpg";

function pnf() {
  return (
    <div className={pnfcss.invalidContainer}>
      <img src={pnfImg} alt="404" />
      <p>Invalid Page</p>
      <div className={pnfcss.homelink}>
        <p>
          Go back to{" "}
          {localStorage.getItem("user-ssid-token-ig") === null ? (
            <Link to={"/"}>home</Link>
          ) : (
            <Link to={"/dashboard"}>Dashboard</Link>
          )}
        </p>
      </div>
    </div>
  );
}

export default pnf;
