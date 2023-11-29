import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import MapStyles from "./MapStyles";
import Loader from "../../Common/Loader";
import { useHistory } from "../../../hooks/useHistory";
import { useParams } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};
var URL = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";


const MapView = ({ marker, filterId, zoom = 25 }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDk4YMVQbv85GukMcQqveKZnwp9AXqQ8Og",
  });
  // eslint-disable-next-line
  const [map, setMap] = useState(null);
  const mapRef = useRef(null)
  const [activeMarker, setActiveMarker] = useState(null);
  const { navigateTo } = useHistory();
  let {tabName} = useParams();


  useEffect(() => {
    if(map && marker) {
      const bounds = new window.google.maps.LatLngBounds();
      marker.forEach((markers) => {
        bounds.extend(markers.position);
      })

      map.fitBounds(bounds);
      if (marker.length === 1) {
        map.setZoom(zoom)
      }
    }
  }, [map, marker])

  // useEffect(() => {
  //   if(map) {
  //     setTimeout(() => {
  //       mapRef && mapRef.current.focus()
  //     }, 200);
  //   }
  // }, [map])

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onLoad = useCallback(function callback(map){
    setMap(map)
  }, [])

  const handleActiveMarker = (marker) => {
    // filterId(marker)
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  const handleCloseMarker = () => {
    filterId(null);
    setActiveMarker(null)
  };

  const handleNavigation = (uniqueId) => {
    filterId(null);
    setActiveMarker(null)
    if(tabName === "Places"){
      navigateTo(`/Places/${uniqueId}`)
    }
    else if(tabName === "Events"){
      navigateTo(`/Events/${uniqueId}`)
    }
  };
  const changeTextColor = (e) => {
    e.target.style.color = 'blue';
  }

  if(!isLoaded) {
    return <><Loader /></>
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={marker && marker.length > 2 ? 25 : 25} 
      options={{ styles: MapStyles.dark}}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={() => handleCloseMarker()}
      ref={mapRef}
    >
      {marker?.map(({id, name, position, uniqueId}, index) => (
        <Marker
          key={index}
          position={position}
          icon={{
            url: URL,
          }}
          onClick={() => handleActiveMarker(id)}
        >
          {activeMarker === id ? (
            <InfoWindow onCloseClick={() => handleCloseMarker()}>
              <div onClick={() => handleNavigation(uniqueId)} onMouseOver={changeTextColor}>{name}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <><Loader /></>
  );
};

export default React.memo(MapView);
