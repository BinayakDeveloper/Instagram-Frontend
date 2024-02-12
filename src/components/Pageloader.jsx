// Assets
import iglogo from "../assets/iglogo.png";

// Style
import pageloadercss from "./../styles/pageloader.module.scss";

function Pageloader() {
  return (
    <div className={pageloadercss.pageloader}>
      <div className={pageloadercss.pageloadercomponents}>
        <img src={iglogo} alt="iglogo" />
      </div>
    </div>
  );
}

export default Pageloader;
