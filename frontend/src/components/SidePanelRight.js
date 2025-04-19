// 📁 src/components/SidePanelRight.js

import React from "react";
import { Home, Cloud, Circle, Moon } from "lucide-react";
import LayerToggle from "../layers/LayerToggle"; // ודא שזה הנתיב הנכון

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

      <button title="מקלטים">
        <Home size={24} />
      </button>
      <button title="מזג אוויר">
        <Cloud size={24} />
      </button>
      <button disabled>
        <Circle size={20} strokeWidth={1} />
      </button>
      <button disabled>
        <Circle size={20} strokeWidth={1} />
      </button>
      <button title="מצב לילה">
        <Moon size={24} />
      </button>
    </div>
  );
};

export default SidePanelRight;
