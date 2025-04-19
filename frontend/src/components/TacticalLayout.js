
import React from 'react';
import TopBar from './TopBar';
import SidePanelLeft from './SidePanelLeft';
import SidePanelRight from './SidePanelRight';
import BottomBar from './BottomBar';
import MainMap from '../layers/MainMap';
import '../styles/TacticalLayout.css';

const TacticalLayout = () => {
  return (
    <div className="tactical-layout">
      <TopBar />
      <div className="middle-section">
        <SidePanelLeft />
        <div className="map-section">
          <MainMap />
        </div>
        <SidePanelRight />
      </div>
      <BottomBar />
    </div>
  );
};

export default TacticalLayout;
