import React, { useContext, useEffect, useRef, useState } from "react";
import MapMarker from "./UtilOrder/MapMarker";
import Modal from "react-modal";
import "../../Components/Pages/order tracker/btnStyles.css";

import { useForm } from "react-hook-form";
import { queryServerApi } from "../../Utils/queryServerApi";
import { SocketContext } from "../../Utils/socketContext";
import AuthService from "../../Components/Pages/AuthServices/auth.service";
import { addTransaction } from "../../Utils/Blockchain";

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
function PaidForm(props) {
  const id = AuthService.getCurrentUser().id;

  const [user, setUser] = useState({});
  const [data, setData] = useState({});
  useEffect(async () => {
    const [us, errs] = await queryServerApi("user/findone/" + id);
    setUser(us);

    const [res, err] = await queryServerApi(
      "card/getCard/" + localStorage.getItem("id_cart")
    );
    setData(res[0]);
  }, []);
  const {
    register,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const { socket } = useContext(SocketContext);
  const handleSubmit = async () => {
    if (user.solde >= data.total + parseInt(localStorage.getItem("cost"))) {
      await queryServerApi(
        "card/update/paiement/" + localStorage.getItem("id_cart"),
        { total: data.total + parseInt(localStorage.getItem("cost")) },
        "PUT",
        false
      );
      console.log(data.products.length);
      await queryServerApi(
        "order/update/activate/" + localStorage.getItem("orderID"),
        {
          items: localStorage.getItem("id_cart"),
          cost: parseInt(localStorage.getItem("cost")),
          article: data.products.length,
          load: data.products.length,
        },
        "PUT",
        false
      );
      await queryServerApi(
        "user/update/payement/" + id,
        { solde: parseFloat(localStorage.getItem("cost")) + data.total },
        "PUT",
        false
      );
      socket.emit("sendWallet", id, {
        cost: Number(localStorage.getItem("cost")) + data.total,
      });
      socket.emit("deleteProd", id, {
        ctn: "yes",
      });
      await queryServerApi(
        "card/delete/" + localStorage.getItem("id_cart"),
        null,
        "PUT",
        false
      );

      data.products.map(async (k, i) => {
        await queryServerApi(
          "user/update/payementS/" + k.seller,
          { solde: k.price },
          "PUT"
        );

        const [seller, err] = await queryServerApi("user/findone/" + k.seller);
        const buyer = AuthService.getCurrentUser();
        console.log("buyer:",buyer)
        console.log("seller:",seller)

        await addTransaction(
          buyer.privateKey,
          buyer.publicKey,
          seller.publicKey,
          k.price
        );
      });
     
    } else props.setTransaction(false);
    props.next();
    localStorage.removeItem("orderID");
    // localStorage.removeItem('card');

    localStorage.removeItem("cost");
  };

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  return data ? (
    <div className="shadow1 html">
      <div className="containersss">
        <h1 style={{ marginTop: "2rem" }}>Payement details</h1>
        <p>Confirmation</p>
        <hr />
        <div className="form">
          <div className="fields fields--2">
            <label className="field">
              <span className="field__label">number of items</span>
              <input
                className="field__input"
                type="text"
                value={data && data.products && data.products.length}
                id="firstname"
                readOnly
                disabled
              />
            </label>
            <label className="field">
              <span className="field__label">SubTotal*</span>
              <input
                className="field__input"
                type="text"
                id="lastname"
                value={data ? data.total : 0}
                readOnly
                disabled
              />
            </label>
          </div>
          <label className="field">
            <span className="field__label">Shipping</span>
            <input
              className="field__input"
              type="text"
              id="address"
              readOnly
              disabled
              value={localStorage.getItem("cost")}
            />
          </label>
          <label className="field">
            <span className="field__label">Total</span>
            <input
              className="field__input"
              type="text"
              id="address"
              value={
                data ? parseInt(localStorage.getItem("cost")) + data.total : 0
              }
              readOnly
              disabled
            />
          </label>
        </div>
        <hr />
        <div className="input-group" style={{ marginLeft: "125px" }}>
          <button className="btn-custom fifth" onClick={props.back}>
            Back
          </button>
          <button className="btn-custom fifth" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        ariaHideApp={false}
        contentLabel="Map Marker"
      >
        <MapMarker closer={closeModal} />
        <button onClick={closeModal} className="btn-custom fifth">
          Close
        </button>
      </Modal>
    </div>
  ) : (
    <div>
      <center>
        <h1>loading data please wait ....</h1>
      </center>
    </div>
  );
}
export default PaidForm;
