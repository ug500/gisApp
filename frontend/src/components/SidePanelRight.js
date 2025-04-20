// 📁 src/components/SidePanelRight.js
import React from "react";
import LayerToggle from "../layers/LayerToggle";
import "./SidePanelRight.css";

const SidePanelRight = ({
  showMunicipalities,
  setShowMunicipalities,
  showAliens,
  setShowAliens,
}) => {
  return (
    <div className="side-panel-right">
      <LayerToggle
        showMunicipalities={showMunicipalities}
        setShowMunicipalities={setShowMunicipalities}
        showAliens={showAliens}
        setShowAliens={setShowAliens}
      />
    </div>
  );
};

export default SidePanelRight;
