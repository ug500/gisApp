// 📁 src/components/TacticalLayout.js
import React from "react";
import SidePanelLeft from "./SidePanelLeft";
import SidePanelRight from "./SidePanelRight";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import ResourceMap from "./ResourceMap";
import "../App.css";
import "./TacticalLayout.css"; // אל תשכח לכלול את ה־CSS

const TacticalLayout = () => {
  return (
    <div className="tactical-layout">
    <TopBar />
    <div className="tactical-center">
  <SidePanelLeft />
  <SidePanelRight />
  <div className="map-container">
    <ResourceMap />
  </div>
</div>

    <BottomBar />
  </div>
  
  );
};

export default TacticalLayout;
