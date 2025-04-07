import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
    axios.get('http://localhost:9000/api/resources')
      .then(response => {
        setResources(response.data);
        setLoading(false);
        if (response.data.length > 0) {
          fitMapToBounds(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
        setError('Failed to load resources.');
        setLoading(false);
      });
  }, []);

  const fitMapToBounds = (resources) => {
    if (!mapRef.current) return;

    const bounds = new L.LatLngBounds();
    resources.forEach(resource => {
      bounds.extend([resource.location.coordinates[1], resource.location.coordinates[0]]);
    });
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  const ResourceMarker = ({ resource }) => {
    return (
      <Marker
        key={resource._id}
        position={[resource.location.coordinates[1], resource.location.coordinates[0]]}
      >
        <Popup>
          {resource.name} <br /> {resource.description}
        </Popup>
      </Marker>
    );
  };

  if (loading) {
    return <div>Loading resources...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <MapContainer
      ref={mapRef}
      center={[0, 0]}
      zoom={2}
      style={{ height: '800px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {resources.map(resource => (
        <ResourceMarker key={resource._id} resource={resource} />
      ))}
    </MapContainer>
  );
};

export default ResourceMap;