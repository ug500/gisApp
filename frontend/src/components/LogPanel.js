import React from 'react';
import './LogPanel.css';

const LogPanel = ({ visible = false, data = [] }) => {
  if (!visible) return null;

  return (
    <div className="log-panel">
      {data.length === 0 ? (
        <div className="log-line">No activity detected.</div>
      ) : (
        data.map((item, index) => (
          <div key={index} className="log-line">
            <span>[{item.time}] </span>
            <strong>{item.id}</strong>{' '}
            {item.type === 'alien' ? (
              <span dangerouslySetInnerHTML={{ __html: item.location }} />
            ) : (
              <span>{item.location}</span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default LogPanel;
