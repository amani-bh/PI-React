import React, { useState } from "react";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import plane from "./m.svg";

export default function MapMarker(prop) {

  const handleCloser = () => {
    prop.closer();
  };
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const HandleClickMap = () => {
    const map = useMapEvents({
      click(e) {
        prop.distance ( e.latlng.lng, e.latlng.lat)
        localStorage.setItem("lat", e.latlng.lat);
        localStorage.setItem("long", e.latlng.lng);

        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
        localStorage.setItem("open", false);
        setTimeout(() => {
          handleCloser();
        }, 500);
      },
    });
    return null;
  };

  const myIcon = new L.Icon({
    iconUrl: plane,
    iconRetinaUrl: plane,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });
  return (
    <>
      <MapContainer
        style={{ margin: "auto", height: "600px", width: "800px" }}
        center={[36.8065, 10.1815]}
        zoom={6}
        scroollWheelZoom={false}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
          attribution="Map tiles by TechTak team |Code of duty"
        />
        <Marker position={[lat, lng]} icon={myIcon}></Marker>
        <HandleClickMap />
      </MapContainer>
    </>
  );
}
