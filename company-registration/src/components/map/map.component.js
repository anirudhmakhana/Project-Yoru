import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import mapStyles from "./map-styles";
import { formatRelative } from "date-fns";

console.log((process.env))

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  };

function Map() {
    const mapRef = React.useRef();
    const [selected, setSelected] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);
    const [currentMark, setCurrentMark] = useState({lat:"",lng:""})
    
    const onMapClick = React.useCallback((e) => {
        setMarkers((current) => [
          ...current,
          {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            time: new Date(),
          },
        ]);
        setCurrentMark({lat:e.latLng.lat().toFixed(3), lng:e.latLng.lng().toFixed(3)})
      }, []);

    const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    }, []);

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 13.756331, lng: 100.501762 }}
      defaultOptions={{ styles: mapStyles }}
      onClick={onMapClick}
      onLoad={onMapLoad}
      options={options}
    >

    {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            
          />
        ))}

    {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>
                <span role="img" aria-label="bear">
                    ⛩
                </span>
              </h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
              <p>{currentMark["lat"]} : {currentMark["lng"]}</p>
            </div>
          </InfoWindow>
        ) : null}

    </GoogleMap>
  );
}
const MapWrapped = withScriptjs(withGoogleMap(Map));
const API_KEY = process.env.REACT_APP_MAP_API_KEY
console.log('test', process.env)
export default function MapPage() {
  return (
    <div style={{width:'100vx', height:'100vh'}}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
          API_KEY
        }`}
        loadingElement={<div style={{ height: `80%` , width: '80%'}} />}
        containerElement={<div style={{ height: `80%` , width: '80%'}} />}
        mapElement={<div style={{ height: `80%` , width: '80%'}} />}
      />
    </div>
  );
}

