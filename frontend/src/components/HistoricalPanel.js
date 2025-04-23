import React, { useState } from 'react';
import './HistoricalPanel.css';

const HistoricalPanel = ({ historyData, visibleIds, onToggle }) => {
  const [filter, setFilter] = useState("ALL");

  const now = Date.now();
  const filteredData = historyData.filter((item) => {
    const timestamp = new Date(item.landing.timestamp).getTime();
    const ageMinutes = (now - timestamp) / 60000;
    switch (filter) {
      case "1H": return ageMinutes <= 60;
      case "12H": return ageMinutes <= 720;
      case "1D": return ageMinutes <= 1440;
      case "1W": return ageMinutes <= 10080;
      default: return true;
    }
  });

  const allIds = filteredData.map(item => item._id.toString());
  const allSelected = allIds.every(id => visibleIds.includes(id));

  const selectAll = () => {
    allIds.forEach(id => {
      if (!visibleIds.includes(id)) {
        onToggle(id, true);
      }
    });
  };

  const clearAll = () => {
    allIds.forEach(id => {
      if (visibleIds.includes(id)) {
        onToggle(id, false);
      }
    });
  };

  return (
    <div className="historical-panel">
      <div className="historical-panel-title">
        היסטוריית 🕘 נחיתות
        <select
          onChange={(e) => setFilter(e.target.value)}
          style={{
            marginTop: '6px',
            width: '100%',
            fontSize: '11px',
            backgroundColor: '#222',
            color: 'white',
            direction: 'rtl',
            textAlign: 'right',
            border: '1px solid #444',
            borderRadius: '4px',
            padding: '2px 6px'
          }}
        >
          <option value="ALL">הצג הכל</option>
          <option value="1H">שעה אחרונה</option>
          <option value="12H">12 שעות</option>
          <option value="1D">יום אחרון</option>
          <option value="1W">שבוע אחרון</option>
        </select>
        {filteredData.length > 0 && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '4px',
            gap: '6px',
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            <span title="Select All" onClick={selectAll}>✅</span>
            <span title="Clear All" onClick={clearAll}>❌</span>
          </div>
        )}
      </div>

      <div className="historical-scroll-container">
  {filteredData
    .slice()
    .reverse()
    .map((item) => {
      const timestamp = new Date(item.landing.timestamp).toLocaleTimeString();
      return (
        <label key={item._id}>
          <input
            type="checkbox"
            checked={visibleIds.includes(item._id.toString())}
            onChange={(e) => onToggle(item._id.toString(), e.target.checked)}
          />
          <span>
            {item.landing.name} <small>({timestamp})</small>
          </span>
        </label>
      );
    })}
</div>

    </div>
  );
};

export default HistoricalPanel;
