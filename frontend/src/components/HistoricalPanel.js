import React from 'react';
import './HistoricalPanel.css';

const HistoricalPanel = ({ historyData, visibleIds, onToggle }) => {
  return (
    <div className="historical-panel">
      <div className="historical-panel-title">🕘 נחיתות היסטוריות</div>
      {historyData
        .slice()
        .reverse()
        .map((item) => {
          const timestamp = new Date(item.landing.timestamp).toLocaleTimeString();
          return (
            <label key={item._id}>
              <input
                type="checkbox"
                checked={visibleIds.includes(item._id.toString())} // ✅ תיקון השוואה
                onChange={(e) => onToggle(item._id.toString(), e.target.checked)} // ✅ לוודא זהה
              />
              <span>
                {item.landing.name} <small>({timestamp})</small>
              </span>
            </label>
          );
        })}
    </div>
  );
};

export default HistoricalPanel;
