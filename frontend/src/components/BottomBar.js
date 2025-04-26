import React, { useState, useEffect } from "react";
import "./BottomBar.css";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import localMunicipalities from "../municipalities.json";

const BottomBar = ({ logItems = [], onLandingSelected }) => {
  const [searchText, setSearchText] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [tickerCycle, setTickerCycle] = useState(0); // 🔥 NEW

  const aliens = logItems.filter(
    (item) => item.type === "alien" && item.id && /^[A-Z]\d+$/.test(item.id)
  );
  const landings = logItems.filter(
    (item) => item.type === "landing" && item.id && /^[A-Z]$/.test(item.id)
  );

  const getMunicipalityName = (lng, lat) => {
    const pt = point([lng, lat]);
    const match = localMunicipalities.features.find((f) => booleanPointInPolygon(pt, f));
    return match?.properties?.MUN_HEB || "אזור לא ידוע";
  };

  // ✅ Build running strip items
  const tickerItems = [];

  // Add landings first
  landings.forEach((landing) => {
    const [lng, lat] = landing.coordinates || [];
    const name = getMunicipalityName(lng, lat);
    tickerItems.push(`🛸 ${landing.id} - ${name}`);
  });

  // Add aliens next
  aliens.forEach((alien) => {
    const [lng, lat] = alien.coordinates || [];
    const name = getMunicipalityName(lng, lat);
    tickerItems.push(`👽 ${alien.id} - ${name}`);
  });

  const tickerText = tickerItems.join(' <span class="dot-separator">•</span> ');

  // ✅ Force re-render ticker every 30 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerCycle((prev) => prev + 1); // 🔄 force ticker refresh
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ Recompute search options if logItems change
  useEffect(() => {
    const freshLandings = logItems.filter(
      (item) => item.type === "landing" && item.id && /^[A-Z]$/.test(item.id)
    );

    const options = freshLandings.map((landing) => {
      const [lng, lat] = landing.coordinates || [];
      const municipality = getMunicipalityName(lng, lat);
      return {
        id: landing.id,
        municipalityName: municipality,
        coordinates: [lat, lng], // lat first for Leaflet
        timestamp: landing.time,
      };
    });

    setSearchOptions(options);
  }, [logItems]);

  const handleSearch = () => {
    const cleanedText = searchText.trim();
    if (!cleanedText) return;

    let landingId = null;
    let municipalityName = null;

    if (cleanedText.includes('-')) {
      const parts = cleanedText.split('-').map((p) => p.trim());
      landingId = parts[0];
      municipalityName = parts[1];
    } else {
      landingId = cleanedText;
      municipalityName = cleanedText;
    }

    let found = searchOptions.find(
      (opt) =>
        opt.id.toUpperCase() === landingId.toUpperCase() ||
        opt.municipalityName.includes(municipalityName)
    );

    if (!found) {
      console.error("🚫 Landing not found for:", cleanedText);
      return;
    }

    console.log("🚀 Sending landing info to parent:", found);
    if (onLandingSelected) {
      onLandingSelected(found);
    }

    // ✅ Clear search input after flying
    setTimeout(() => {
      setSearchText("");
    }, 500);
  };

  return (
    <div className="bottom-bar-wrapper">
      <div className="top-strip" />

      <div className="bottom-bar">
        <div className="ticker-area">
          <div className="ticker">
            {/* ✅ tickerCycle forces refresh every 30 sec */}
            <span key={tickerCycle} dangerouslySetInnerHTML={{ __html: tickerText }} />
          </div>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="חפש לפי אות נחיתה או שם עיר..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          list="landings-list"
          autoFocus
        />
        <datalist id="landings-list">
          {searchOptions.map((opt, idx) => (
            <option key={idx} value={`${opt.id} - ${opt.municipalityName}`} />
          ))}
        </datalist>

        <button className="submit-button" onClick={handleSearch}>
          Submit
        </button>

        <div className="copyright">
          Copyright 2025 © by Amos B. Shmulik G. & Uzi G.
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
