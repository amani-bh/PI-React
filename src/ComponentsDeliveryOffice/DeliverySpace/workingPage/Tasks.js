import React, { useContext, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import plane from "../../OrderForm/UtilOrder/order.svg";
import marker from "../../OrderForm/UtilOrder/marker.svg";
import { Link } from "react-router-dom";
import client from "../../OrderForm/UtilOrder/client.svg";
import L from "leaflet";
import { motion } from "framer-motion";
import "./main.css";
import { queryServerApi } from "../../../Utils/queryServerApi";
import Signature from "./signature";
import "leaflet-routing-machine";
import Routing from "./Routing";
import { SocketContext } from "../../../Utils/socketContext";
import AuthService from "../../../Components/Pages/AuthServices/auth.service";
export default function Main() {
  const [act, setAct] = useState(0);
  const [data, setData] = useState([]);
  const [long, setLong] = useState(0);
  const [larg, setLarg] = useState(0);
  const [cont, setCont] = useState(false);
  const [timer, setTimer] = useState({ id: 1, uid: -1 });
  const [connector, setConnector] = useState(false);
  const [tab, setTab] = useState([]);
  const [tabOrders, setTabOrders] = useState([]);
  const { socket } = useContext(SocketContext);
  const [quiter,setQuiter]=useState(false);
  const id = AuthService.getCurrentUser().id ;

  useEffect(async () => {
    const [resOrder] = await queryServerApi("order/get/ByDeliveryMan/" + id);
    setData(resOrder);
    resOrder.map((das, i) => {
      if (das.status === "in progress")
        setQuiter(true);
      setTab((dsa) => [...dsa, das.clientID]);
      setTabOrders((dsp) => [...dsp, das._id]);
    });
  }, [connector, timer]);

  const childTimer = (data) => {
    setTimer(data);
  };
  const childConnect = () => {
    setConnector(!connector);
  };

  setInterval(() => {
    navigator.geolocation.getCurrentPosition((d) => {
      setLarg(d.coords.longitude);
      setLong(d.coords.latitude);
      if (tab.length != 0 && tabOrders.length != 0) {
        socket.emit("sendTracker", tab, {
          long: d.coords.latitude,
          larg: d.coords.longitude,
          order: tabOrders,
          delID: id,
        });
      }
    });
  }, 3000);

  function distance(lat1, lat2, lon1, lon2) {
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let r = 6371;
    return c * r;
  }
  const myIcon = new L.Icon({
    iconUrl: plane,
    iconRetinaUrl: plane,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });
  const clientLoc = new L.Icon({
    iconUrl: client,
    iconRetinaUrl: client,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });

  const currentLoc = new L.Icon({
    iconUrl: marker,
    iconRetinaUrl: marker,
    popupAnchor: [-0, -0],
    iconSize: [32, 45],
  });

  const detail = (obj, loc) => {
    return (
      <motion.div className="tasks" style={{ marginRight: "18%" }}>
        <MapContainer
          className="mapOf"
          scrollWheelZoom={true}
          center={[36, 9]}
          zoom={7}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
            attribution="Map tiles by TechTak team |Code of duty"
          ></TileLayer>
          {long != 0 && larg != 0 && (
            <Marker position={[long, larg]} icon={currentLoc} />
          )}
          <Marker
            position={[loc.locationClient.long, loc.locationClient.larg]}
            icon={clientLoc}
          >
            <Popup>
              <center>
                <a
                  style={{ cursor: "pointer", color: "blue" }}
                  className=""
                  onClick={() => {
                    setCont(true);
                  }}
                  type="button"
                >
                  Get itinerary
                </a>
              </center>
              {cont && (
                <Routing
                  data={{
                    l: long,
                    d: larg,
                    lat: loc.locationClient.long,
                    latr: loc.locationClient.larg,
                    id: loc._id,
                  }}
                  child={childTimer}
                />
              )}
            </Popup>
          </Marker>

          {loc.products.map((da) => {
            if (da.shipped == false) {
              return (
                <div key={da._id}>
                  <Marker
                    position={[da.location.long, da.location.larg]}
                    icon={myIcon}
                  >
                    <Popup>
                      <a
                        style={{ cursor: "pointer", color: "blue" }}
                        onClick={() => {
                          setCont(true);
                        }}
                      >
                        Get itinerary
                      </a>

                      {cont && (
                        <Routing
                          data={{
                            l: long,
                            d: larg,
                            lat: da.location.long,
                            latr: da.location.larg,
                            id: da._id,
                          }}
                          child={childTimer}
                        />
                      )}
                    </Popup>
                  </Marker>
                </div>
              );
            }
          })}
        </MapContainer>
        <div className="wrapper" >
          <ol className="c-timeline">
            {loc.products.map((da) => {
              return (
                <li key={da._id} className="c-timeline__item">
                  <div
                    className={
                      da.shipped ? "c-timelin__content" : "c-timeline__content"
                    }
                  >
                    <h3 className=" h3 c-timeline__title" >
                      {da.name}

                      {timer.id != 0 && timer.uid == da._id && (
                        <span
                          className="c-timeline__desc"
                          style={{
                            fontWeight: "bold",
                            fontSize: "1rem",
                            letterSpacing: "0",
                            color: "purple",
                          }}
                        >
                          {" - "}Estimated time: {timer.id} Minutes
                        </span>
                      )}
                    </h3>

                    <p className="c-timeline__desc">
                      <i
                        className="fa-solid fa-c"
                        style={{ color: "#FF4858" }}
                      ></i>{" "}
                      : {da.category}
                    </p>
                    <p  className="c-timeline__desc pi">
                      <i
                        className="fa-solid fa-d"
                        style={{ color: "#FF4858" }}
                      ></i>{" "}
                      : {da.description}
                    </p>

                    <div className="c-timeline__desc">
                      <Signature
                        data={{
                          uid: da._id,
                          id: loc._id,
                          sh: da.shipped,
                          order_id: loc._id,
                          client_id: loc.clientID,
                          d: loc,
                        }}
                        connect={childConnect}
                      />
                    </div>
                  </div>
                  <time style={{ fontWeight: "bold" }}>
                    {Math.round(
                      distance(da.location.long, long, da.location.larg, larg)
                    )}{" "}
                    KM{" "}
                  </time>
                </li>
              );
            })}
            <li className="c-timeline__item">
              <div className="c-timeline__content">
                <h3 className=" h3 c-timeline__title">
                  Client <i className="fas fa-person-booth    "></i>
                  {timer.id != 0 && timer.uid == loc._id && (
                    <span
                      className="c-timeline__desc"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1rem",
                        letterSpacing: "0",
                        color: "black",
                      }}
                    >
                      {" - "} Estimated time: {timer.id} Minutes
                    </span>
                  )}
                </h3>
                <p className="c-timeline__desc">
                  <i className="fa-solid fa-n" style={{ color: "#FF4858" }}></i>{" "}
                  : {loc.firstName}
                </p>

                <p className="c-timeline__desc">
                  <i
                    className="fa fa-phone"
                    aria-hidden="true"
                    style={{ color: "green" }}
                  ></i>{" "}
                  : {loc.telephone}
                </p>
                <p className="c-timeline__desc">
                  <i className="fa-solid fa-s" style={{ color: "#FF4858" }}>
                    tatus
                  </i>{" "}
                  :{" "}
                  {loc.status == "in progress" && (
                    <img
                      style={{ height: "75px", width: "100px" }}
                      src="https://tradlibre.fr/img/loading4.gif"
                    />
                  )}
                </p>
              </div>
              <time style={{ fontWeight: "bold" }}>
                {" "}
                {Math.round(
                  distance(
                    loc.locationClient.long,
                    long,
                    loc.locationClient.larg,
                    larg
                  )
                )}{" "}
                KM{" "}
              </time>
            </li>
          </ol>
        </div>
      </motion.div>
    );
  };
  return data ? (

    <motion.article
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 3 }}
    >
      {quiter ? (
        <div className=" maper pad o">
          {data.map((obj, i) => {
            if (obj.status == "in progress") {
              return (
                <div key={i}>
                  <br />
                  <h3 className="h3">
                    <a
                      type="button"
                      style={{ fontWeight: "bold" }}
                      onClick={() => {
                        setAct(i);
                      }}
                    >
                      Order Ref #{i + 1}/{obj.date.substring(0, 10)}{" "}
                    </a>
                  </h3>

                  {act === i && detail(obj.items, obj)}
                </div>
              );
            }
          })}
        </div>
      ) : (
        <center style={{ marginTop: "10%", marginBottom: "5%" }}>
          <h1 style={{ color: "#6734FD" }}>
            You don't have any task yet .. ?!{" "}
          </h1>
          <h4 style={{ color: "#6734FD" }}>
            {" "}
            Please go and pick your tasks from the map
          </h4>
          <h4>
            <Link style={{ color: "#E90626" }} to="/delivery/home">
              Go Here{" "}
            </Link>
          </h4>
        </center>
      )}
    </motion.article>
  ) : (
    <center style={{ marginTop: "10%", marginBottom: "5%" }}>
      <h1 style={{ color: "#6734FD" }}>loading data please wait ... </h1>
    </center>
  );
}
