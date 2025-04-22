import React, { useState } from "react";
import "./BottomBar.css";

const BottomBar = ({ logItems = [] }) => {
  const [searchText, setSearchText] = useState("");
  const [resultLine, setResultLine] = useState("");

  const aliens = logItems.filter(
    (item) => item.type === "alien" && item.id && /^[A-Z]\d+$/.test(item.id)
  );
  const landings = logItems.filter(
    (item) => item.type === "landing" && item.id && /^[A-Z]$/.test(item.id)
  );

  const grouped = {};
  aliens.forEach((alien) => {
    const key = alien.id[0];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(`👽 ${alien.id}`);
  });

  landings.forEach((landing) => {
    const key = landing.id;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(`🛸 ${landing.id}`);
  });

  const tickerText = Object.values(grouped)
    .flat()
    .join(' <span class="dot-separator">•</span> ');

  const handleSearch = () => {
    const key = searchText.trim().toUpperCase();
    if (!key || !grouped[key]) return setResultLine("");
    const result = grouped[key].join(' <span class="dot-separator">•</span> ');
    setResultLine(result);
  };

  return (
    <div className="bottom-bar-wrapper">
      <div className="top-strip" />

      <div className="bottom-bar">
        <div className="ticker-area">
          <div className="ticker">
            <span dangerouslySetInnerHTML={{ __html: tickerText }} />
          </div>
        </div>

        {resultLine && (
          <div
            className="result-line"
            dangerouslySetInnerHTML={{ __html: resultLine }}
          />
        )}

        <input
          type="text"
          className="search-input"
          placeholder="Search by landing letter (e.g. A)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="submit-button" onClick={handleSearch}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default BottomBar;