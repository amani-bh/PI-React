import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import { popupContent, popupHead, popupText, okText } from "./styles";
import { useNavigate } from "react-router-dom";
import { queryServerApi } from "../../../Utils/queryServerApi";
import axios from "axios";
import L from "leaflet";
import plane from "../../OrderForm/UtilOrder/order.svg";
import locator from "../../OrderForm/UtilOrder/marker.svg";
import client from "../../OrderForm/UtilOrder/client.svg";
import "./styles.css";
import { SocketContext } from "../../../Utils/socketContext";
import AuthService from "../../../Components/Pages/AuthServices/auth.service";

const Maps = () => {
  const [orders, setOrder] = useState({ ds: [] });
  const [Products, setProds] = useState([]);
  const navigate = useNavigate();
  var k = 0;
  const [s, setS] = useState(null);
  const [p, setP] = useState(null);
  const { socket } = useContext(SocketContext);
  const id = AuthService.getCurrentUser().id ;

  useEffect(async () => {
    const [data] = await queryServerApi(`order/get/all`);
    setOrder({ ds: data });

    Object.keys(data).map((obj) => {
        if (
          data[obj].status == "not taken" &&
          data[obj].activation == true        ) {
          setProds((Products) => [...Products, data[obj].products]);
        }
    });
  }, []);
  navigator.geolocation.getCurrentPosition((data) => {
    if (data.coords.latitude) {
      setS(data.coords.latitude);
      setP(data.coords.longitude);
    }
  });

  setInterval(() => {
    navigator.geolocation.getCurrentPosition((data) => {
      if (data.coords.latitude != s && data.coords.latitude) {
        setS(data.coords.latitude);
        setP(data.coords.longitude);
      }
    });
  }, 60000);

  const takeOrder = async (data, i) => {
    await axios.put(
      `${process.env.REACT_APP_URI}/order/update/starter/` + data._id,
      {
        delID: id,
        load: data.article + 1,
      }
    );

    navigate("/delivery/tasks");
    await queryServerApi(
      "notif/delivery/postNotif",
      { message: "you just take order", ref: data._id, id_LIV: id },
      "POST",
      false
    );
    
    socket.emit("notificationDelivery", id, {
      ref: data._id,
      message: "you just take order",
      date: new Date(),
    });
  };
  const locatorIcon = new L.Icon({
    iconUrl: locator,
    iconRetinaUrl: locator,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });

  const clientIcon = new L.Icon({
    iconUrl: client,
    iconRetinaUrl: client,

    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });

  const myIcon = new L.Icon({
    iconUrl: plane,
    iconRetinaUrl: plane,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });
  var z = [];
  var k = [];
  const colors = ["black", "red", "blue", "green", "crimson", "grey", "purple"];
  return (
    <motion.div
      className="containerss "
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 3 }}
    >
      <MapContainer
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "40rem",
          zIndex: "1",
          borderRadius: "3%",
        }}
        center={[36.8065, 10.1815]}
        zoom={6}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
          attribution="Map tiles by TechTak team |Code of duty"
        />
        {s != null && p != null && (
          <Marker position={[s, p]} icon={locatorIcon} />
        )}
        {orders.ds.map((data, i) => {
          if (data.status == "not taken" && data.activation === true) {
            k.push([data.locationClient.long, data.locationClient.larg]);
            return (
              <div key={i}>
                <Marker
                  position={[
                    data.locationClient.long,
                    data.locationClient.larg,
                  ]}
                  key={i}
                  icon={clientIcon}
                >
                  <Popup className="request-popup">
                    <div style={popupContent}>
                      <img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo7uaIBDsEnqc-9Kfo-6PCr57tOEL1VvuNjg&usqp=CAU"
                        width="70"
                        height="8"
                        alt="no img"
                      />
                      <div className="m-2" style={popupHead}>
                        Shipping informations
                      </div>
                      <span style={popupText}>
                        <p style={{ color: "black" }}>
                          Owner :{" "}
                          <input value={data.firstName} readOnly disabled />
                        </p>
                        <p style={{ color: "black" }}>
                          Items :{" "}
                          <input value={data.article} readOnly disabled />
                        </p>
                        <p style={{ color: "black" }}>
                          Phone :{" "}
                          <input value={data.telephone} readOnly disabled />{" "}
                        </p>
                        <p style={{ color: "black", marginRight: "8px" }}>
                          Cost :
                          <input
                            value={data.cost}
                            readOnly
                            disabled
                            style={{ color: "black", marginLeft: "18px" }}
                          />{" "}
                        </p>
                      </span>
                      <div className="m-2" style={okText}>
                        <button
                          type="button"
                          className="btn btn-outline-dark"
                          onClick={() => takeOrder(data, i)}
                        >
                          Take it{" "}
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          }
        })}
        {Products.map((datas, j) => {
          z.push([]);
          return datas.map((s, p) => {
            z[j].push([s.location.long, s.location.larg]);
            return (
              <Marker
                position={[s.location.long, s.location.larg]}
                key={p + 1200}
                icon={myIcon}
              />
            );
          });
        })}
        {z.map((data, i) => {
          z[i].push(k[i]);
        })}

        {z.map((e, i) => {
          return (
            <Polygon
              pathOptions={{
                color: colors[Math.floor(Math.random() * colors.length)],
              }}
              positions={z[i]}
              key={i}
            />
          );
        })}
      </MapContainer>
    </motion.div>
  );
};
export default Maps;
