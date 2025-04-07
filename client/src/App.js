import React from 'react';
import ResourceMap from './components/ResourceMap'; // Adjust the path if necessary
/*import './App.css'; // You can keep your existing App.css if you have any general styles*/

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>My Resource Map</h1> */} {/* Add a title */}
      </header>
      <main>
        <ResourceMap /> {/* Include your map component */}
      </main>
    </div>
  );
}

export default App;