import React, { useContext, useState } from "react";
import SignaturePad from "react-signature-canvas";
import Modal from "react-modal";
import GifLoader from "react-gif-loader";
import { queryServerApi } from "../../../Utils/queryServerApi";
import styles from "./workStylesClient.css";
import { SocketContext } from "../../../Utils/socketContext";
import { addTransaction } from "../../../Utils/Blockchain";
import AuthService from "../AuthServices/auth.service";


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
export default function SignatureClient(props) {
  const { socket } = useContext(SocketContext);
  const [promiseInProgress, setP] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const [sigPad, setSigPad] = useState({});
  const [cont, setCont] = useState(true);
  const clear = () => {
    sigPad.clear();
  };

  const trim = async () => {
    setP(true);
    await queryServerApi(
      "order/update/finisher/" + props.data.obj._id,
      null,
      "PUT"
    );
    await queryServerApi(
      "user/update/payementD/" + props.data.obj.delID,
      { solde: props.data.obj.cost.toString() },
      "PUT"
    );
    const buyer = AuthService.getCurrentUser();
    const [deliveryMan, err] = await queryServerApi("user/findone/" + props.data.obj.delID);


    await addTransaction(
      buyer.privateKey,
      buyer.publicKey,
      deliveryMan.publicKey,
      parseInt(props.data.obj.cost)
    );

    await queryServerApi(
      "notif/delivery/postNotif",
      {
        ref: props.data.obj._id,
        message:
          "you just finish another task" +
          " " +
          "and earnd" +
          " " +
          props.data.obj.cost +
          " " +
          "coins",
        id_LIV: props.data.obj.delID,
      },
      "POST",
      false
    );

    socket.emit("notificationDelivery", props.data.obj.delID, {
      ref: props.data.obj_id,
      message:
        "you just finish another task" +
        " " +
        "and earnd" +
        props.data.obj.cost +
        " " +
        " coins",
      date: new Date(),
    });
    props.fin(true);
    setCont(false);
    // setTrimmedDataURL(sigPad.getTrimmedCanvas().toDataURL("image/png"));

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
            className="btn-custom fifth"
            onClick={() => openModal()}
            hidden={!cont}
          >
            Sign it
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

                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button className="btn-custom fifth" onClick={clear}>
                      Clear
                    </button>
                    <button className="btn-custom fifth" onClick={trim}>
                      Confirm
                    </button>
                  </div>
                </Modal>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
