import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import stl from "./OrderForm.css";
import MapMarker from "./UtilOrder/MapMarker";
import Modal from "react-modal";
import CSSModules from "react-css-modules";
import "../../Components/Pages/order tracker/btnStyles.css";

import { useForm } from "react-hook-form";
import { queryServerApi } from "../../Utils/queryServerApi";
import AuthService from "../../Components/Pages/AuthServices/auth.service";

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
function OrderForm(props) {
  const id = AuthService.getCurrentUser().id;

  const [cost, setCost] = useState(0);
  const [data, setData] = useState({});
  useEffect(async () => {
    const [res, err] = await queryServerApi(
      "card/getCard/" + localStorage.getItem("id_cart")
    );
    setData(res[0]);
  }, []);
  const first = useRef();
  const {
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const [waiter, setWaiter] = useState(false);
  const handleSubmit = async () => {
    console.log(data.products.length);
    await axios
      .post(`${process.env.REACT_APP_URI}/order/post`, {
        locationClient: {
          larg: Number(localStorage.getItem("long")),
          long: Number(localStorage.getItem("lat")),
        },
        products: data.products,
        firstName: getValues("firstName"),
        telephone: getValues("tel"),
        load: data.products.length,
        clientID: id,
      })
      .then((data) => {
        localStorage.setItem("orderID", data.data._id);

        localStorage.removeItem("lat");
        localStorage.removeItem("long");
      });

    props.clickme();
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      calculCost(pos.coords.longitude, pos.coords.latitude);

      localStorage.setItem("lat", pos.coords.latitude);
      localStorage.setItem("long", pos.coords.longitude);
    });
  };

  const [mapper, setMapper] = useState("test");
  const handlePosition = async (event) => {
    setCost(0);
    if (event.target.value.includes("current")) currentLocation();
    if (event.target.value.includes("map")) {
      openModal();
    }
    setMapper("pos");
  };

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
  const calculCost = async (l, t) => {
    var c = 0;

    data.products.map((prod, i) => {
      c += distance(l, prod.location.larg, t, prod.location.long) * 0.1;
    });
    setCost(c);

    localStorage.setItem("cost", Math.round(c, 2));
  };
  return (
    <div className="shadow1 html">
      <div className="containersss">
        <h1 style={{ marginTop: "2rem" }}>Shipping</h1>
        <p>Please enter your shipping details.</p>
        <hr />
        <div className="form">
          <div className="fields fields--2">
            <label className="field">
              <span className="field__label">First name*</span>
              <input
                className="field__input"
                type="text"
                id="firstname"
                {...register("firstName", { required: true })}
              />
            </label>
            <label className="field">
              <span className="field__label">Last name*</span>
              <input
                className="field__input"
                type="text"
                id="lastname"
                {...register("lastName", { required: true })}
              />
            </label>
          </div>
          <label className="field">
            <span className="field__label">Telephone*</span>
            <input
              className="field__input"
              type="text"
              id="address"
              {...register("tel", { required: true })}
            />
          </label>

          <label className="field">
            <span className="field__label">Address*</span>
            <select
              className="field__input"
              id="adress"
              {...register("adress", { required: true })}
              onChange={handlePosition}
            >
              <option value="test">Choose an option</option>
              <option value="current">Get my current position </option>
              <option value="map">Get my position from the map</option>
            </select>
          </label>

          {cost != 0 && (
            <label className="field">
              <span className="field__label">Cost</span>
              <input
                className="field__input"
                type="text"
                id="cost"
                value={cost != 0 && Math.round(cost, 2) + " Coins"}
                readOnly
                {...register("cost", { required: true })}
              />
            </label>
          )}
        </div>
        <hr />
        <center>
          <button
            className={isValid && mapper != "test" ? "btn-custom fifth" : "btn"}
            onClick={handleSubmit}
            disabled={isValid == false}
          >
            Continue
          </button>
        </center>
      </div>
      <Modal
        isOpen={modalIsOpen}
        //  onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Map Marker"
      >
        <MapMarker closer={closeModal} distance={calculCost} />
        <button onClick={closeModal} className="btn-custom fifth">
          Close
        </button>
      </Modal>
    </div>
  );
}
export default OrderForm;
