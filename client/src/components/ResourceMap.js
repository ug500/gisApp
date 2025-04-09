import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';

// Fix for Leaflet's default marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const ResourceMap = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:9000/api/points'),
      axios.get('http://localhost:9000/api/linestrings'),
      axios.get('http://localhost:9000/api/polygons'),
    ])
      .then(([pointsResponse, lineStringsResponse, polygonsResponse]) => {
        const allResources = [
          ...pointsResponse.data,
          ...lineStringsResponse.data,
          ...polygonsResponse.data,
        ];
        setResources(allResources);
        console.log('Client-side resources:', allResources);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
        setError('Failed to load resources.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading resources...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <MapContainer
        ref={mapRef}
        center={[40.71, -74.00]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
        onError={(error) => console.error('MapContainer Error (Minimal):', error)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {resources.map(resource => {
          if (resource.location && resource.location.type === 'Point') {
            return (
              <Marker
                key={resource._id}
                position={[resource.location.coordinates[1], resource.location.coordinates[0]]}
              >
                <Popup>
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                </Popup>
              </Marker>
            );
          } else if (resource.location && resource.location.type === 'LineString' && Array.isArray(resource.location.coordinates) && resource.location.coordinates.length > 1) {
            return (
              <Polyline
                key={resource._id}
                positions={resource.location.coordinates.map(coord => [coord[1], coord[0]])}
                color="blue"
                weight={3}
              >
                <Popup>
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                </Popup>
              </Polyline>
            );
          } else if (resource.location && resource.location.type === 'Polygon' && Array.isArray(resource.location.coordinates) && resource.location.coordinates.length > 0) {
            return (
              <Polygon
                key={resource._id}
                positions={resource.location.coordinates.map(ring => ring.map(coord => [coord[1], coord[0]]))}
                color="green"
                fillOpacity={0.3}
              >
                <Popup>
                  <h3>{resource.name}</h3>
                  <p>{resource.description}</p>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default ResourceMap;