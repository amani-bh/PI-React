import React, { useContext, useEffect, useState } from "react";
import { queryServerApi } from "../../../Utils/queryServerApi";
import del from "./utilsOrders/del.svg";
import prod from "./utilsOrders/prod.svg";
import me from "./utilsOrders/me.svg";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet";
import "./btnStyles.css";
import Modal from "react-modal/lib/components/Modal";
import { SocketContext } from "../../../Utils/socketContext";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
export default function MapTracker(props) {
  var z = [];

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { socket } = useContext(SocketContext);

  const deliveryMan = new L.Icon({
    iconUrl: del,
    iconRetinaUrl: del,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });
  const currentPos = new L.Icon({
    iconUrl: me,
    iconRetinaUrl: me,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });
  const prodSeller = new L.Icon({
    iconUrl: prod,
    iconRetinaUrl: prod,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });

  const [larg, setLarg] = useState(0);
  const [long, setLong] = useState(0);

  useEffect(() => {
    socket.on("getTracker", (data) => {
      if (
        data.ctn.long != long &&
        data.ctn.larg != larg &&
        data.ctn.long &&
        data.ctn.order.includes(props.data.obj._id) &&
        data.ctn.delID == props.data.obj.delID
      ) {
        setLong(data.ctn.long);
        setLarg(data.ctn.larg);
      }
    });
  }, [larg, long]);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      {!modalIsOpen && (
        <button type="button" className="btn-custom fifth" onClick={openModal}>
          Track it
        </button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Map Marker"
      >
        {long != 0 ? (
          <MapContainer
            style={{ margin: "auto", height: "600px", width: "800px" }}
            center={[36.8065, 10.1815]}
            zoom={6}
            scroollWheelZoom={false}
          >
            {z.push([long, larg])}
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
              attribution="Map tiles by TechTak team |Code of duty"
            >
              {" "}
            </TileLayer>
            <Marker position={[long, larg]} icon={deliveryMan}></Marker>

            <Marker
              position={[
                props.data.obj.locationClient.long,
                props.data.obj.locationClient.larg,
              ]}
              icon={currentPos}
            ></Marker>

            {  props.data.obj.products.map((dk, p) => {
              if (dk.shipped == false) {
                z.push([dk.location.long, dk.location.larg]);
                return (
                  <Marker
                    icon={prodSeller}
                    position={[dk.location.long, dk.location.larg]}
                    key={dk._id}
                  ></Marker>
                );
              }
            })}
            {z.push([
              props.data.obj.locationClient.long,
              props.data.obj.locationClient.larg,
            ])}

            <Polygon
              pathOptions={{
                color: "crimson",
              }}
              positions={z}
            />
          </MapContainer>
        ) : (
          <center>
            <h1 style={{ color: "#6E26FF" }}>
              Delivery man is not connected ...
            </h1>
          </center>
        )}{" "}
      </Modal>
    </div>
  );
}
