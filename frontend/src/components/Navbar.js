import React from 'react';
import './Navbar.css';

function Navbar({ onToggleLog }) {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="log-button" onClick={onToggleLog}
        >
          LOG
        </button>
      </div>
      <div className="navbar-title">INVASION CONTROL</div>
    </div>
  );
}

export default Navbar;
