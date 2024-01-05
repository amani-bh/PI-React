import React, { useContext, useEffect, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import Modal from "react-modal";
import GifLoader from "react-gif-loader";

import { queryServerApi } from "../../../Utils/queryServerApi";
// import Loader from 'react-loader-spinner';
import styles from "./workStyles.css";
import { SocketContext } from "../../../Utils/socketContext";
import AuthService from "../../../Components/Pages/AuthServices/auth.service";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    overlay: { zIndex: 10000000000000000000000 },
    transform: "translate(-50%, -50%)",
  },
};
function Signature(props) {
  const id = AuthService.getCurrentUser().id ;

  const [promiseInProgress, setP] = useState(false);
  const { socket } = useContext(SocketContext);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [sigPad, setSigPad] = useState({});
  const [cont, setCont] = useState(true);
  const clear = () => {
    sigPad.clear();
  };
  const trim = async () => {
    setP(true);
    setCont(false);
    setTrimmedDataURL(sigPad.getTrimmedCanvas().toDataURL("image/png"));
    await queryServerApi(
      "order/updateProductOrder/" +
        props.data.uid +
        "/" +
        props.data.id +
        "/" +
        props.data.order_id,
      null,
      "PUT",
      false
    );
    await queryServerApi(
      "notif/delivery/postNotif",
      {
        ref: props.data.id,
        message: "you just sign that you took Product N:" + props.data.id,
        ref: props.data._id,
        id_LIV: id,
      },
      "POST",
      false
    );
    socket.emit("notificationDelivery", id, {
      ref: props.data.id,
      message: "you just sign that you took Product N:" + props.data.id,
      date: new Date(),
    });
    socket.emit("shippingProd", props.data.client_id, {
      id: 1,
      order: props.data.order_id,
    });
    console.log(props.data.client_id);
    props.connect();
    setP(false);
  };
  const style = { marginTop: "-150px", width: "200px", height: "200px" };
  return (
    <>
      {promiseInProgress ? (
        <GifLoader
          loading={true}
          imageSrc="https://c.tenor.com/A1FK9d9uQosAAAAi/bc-loading-loading-big-coffee.gif"
          imageStyle={style}
          overlayBackground="rgba(0,0,0,0)"
        />
      ) : (
        <div className={styles.containers}>
          <button
            type="button"
            className="btn btn-outline-purple"
            onClick={() => openModal()}
            hidden={!cont || props.data.sh}
          >
            Sign
            <i className="fas fa-signature"></i>
          </button>

          {cont && (
            <div>
              {" "}
              <div className={styles.sigContainer}>
                <Modal
                  style={{ zIndex: "100000000000" }}
                  isOpen={modalIsOpen}
                  //  onAfterOpen={afterOpenModal}
                  onRequestClose={closeModal}
                  style={customStyles}
                  ariaHideApp={false}
                  contentLabel="Map Marker"
                >
                  <SignaturePad
                    canvasProps={{ className: styles.sigPad }}
                    ref={(ref) => {
                      setSigPad(ref);
                    }}
                  />

                  <div>
                    <button className="btn btn-outline-dark" onClick={clear}>
                      Clear
                    </button>
                    <button className="btn btn-outline-dark" onClick={trim}>
                      Confirm
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          )}
          {trimmedDataURL ? (
            <img
              alt="Lim"
              style={{ width: "20%", height: "20%" }}
              className={styles.sigImage}
              src={trimmedDataURL}
            />
          ) : null}
        </div>
      )}
    </>
  );
}
export default Signature;
