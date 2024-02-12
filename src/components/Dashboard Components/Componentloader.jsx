// Assets
import iglogo from "../../assets/iglogo.png";

// Style
import componentloadercss from "../../styles/Dashboard Styles/componentloader.module.scss";

function Componentloader() {
  return (
    <div className={componentloadercss.componentloader}>
      <div className={componentloadercss.componentloadercomponents}>
        <img src={iglogo} alt="iglogo" />
      </div>
    </div>
  );
}

export default Componentloader;
