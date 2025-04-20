// 📁 src/components/SidePanelRight.js
import React from "react";
import LayerToggle from "../layers/LayerToggle";
import "./SidePanelRight.css";

const SidePanelRight = ({
  showMunicipalities,
  setShowMunicipalities,
  showLandings,
  setShowLandings,
  showHistory,
  setShowHistory,
  showAliens,
  setShowAliens,
  showShelters,
  setShowShelters,
  showWeather,
  setShowWeather,
  nightMode,
  setNightMode,
}) => {
  return (
    <div className="side-panel-right">
      <LayerToggle
        // פונקציות הדלקה/כיבוי
        onToggleMunicipalities={() => setShowMunicipalities(!showMunicipalities)}
        onToggleLandings={() => setShowLandings(!showLandings)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onToggleAliens={() => setShowAliens(!showAliens)}
        onToggleShelters={() => setShowShelters(!showShelters)}
        onToggleWeather={() => setShowWeather(!showWeather)}
        onToggleNightMode={() => setNightMode(!nightMode)}

        // מצבי נראות נוכחיים
        showMunicipalities={showMunicipalities}
        showLandings={showLandings}
        showHistory={showHistory}
        showAliens={showAliens}
        showShelters={showShelters}
        showWeather={showWeather}
        nightMode={nightMode}
      />
    </div>
  );
};

export default SidePanelRight;
