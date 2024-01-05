import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyExchanges } from "../../Utils/Exchange";
import { getExchangesRequest } from "../../Utils/Exchange";

import { deleteExchange } from "../../Utils/Exchange";
import { confirmExchange } from "../../Utils/Exchange";
import { declineExchange } from "../../Utils/Exchange";
import { updateExchange } from "../../Utils/Exchange";

import "./Exchange.css";
import { format } from "timeago.js";
import AuthService from "./AuthServices/auth.service"


export default function UserExchanges() {
  let total = 0;
  const id_user = AuthService.getCurrentUser().id ;

  const [myExchanges, setMyExchange] = useState();
  const [exchangesRequest, setExchangesRequest] = useState();

  const [myProduct, setMyProduct] = useState(null);
  const [deleteEx, setDeletedEx] = useState(null);
  const [confirmEx, setConfirmEx] = useState(null);
  const [declineEx, setDeclineEx] = useState(null);
  const [updateEx, setUpdateEx] = useState(false);
  const [amount, setAmount] = useState(null);

  const [myPropositions, setMyPropositions] = useState(true);
  const [myRequest, setMyRequest] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const resultMy = await getMyExchanges(id_user);
      setMyExchange(resultMy);
      const resultReq = await getExchangesRequest(id_user);
      setExchangesRequest(resultReq);

      //const resultMyProduct = await getProductById(myExchanges.productSender);
      // const resultProductToExchange = await getProductById(myExchanges.productReciever);

      //setMyProduct(resultMyProduct);

      //setProductToExchange(resultProductToExchange);
    };
    fetchData();
  }, [deleteEx, confirmEx, declineEx, updateEx]);

  const deleteExch = async (id) => {
    const result = await deleteExchange(id);
    setDeletedEx(true);
    console.log(id);
    //setCart( result);
  };

  const confirmExch = async (id) => {
    const result = await confirmExchange(id);
    setConfirmEx(true);
    //setCart( result);
  };

  const declineExch = async (id) => {
    const result = await declineExchange(id);
    setDeclineEx(true);
    //setCart( result);
  };
  const updateExch = async (id) => {
    if (!updateEx) {
      setUpdateEx(true);
    }
    if (updateEx) {
      const exchangeUpdate = {
        amount: amount,
      };
      const result = await updateExchange(id, exchangeUpdate);

      setUpdateEx(false);
    }

   // const result = await declineExch(id);
    //setCart( result);
  };
  const handleChangeAmount = (e) => {
    console.log(e.target.value);
    if (e != undefined) setAmount(e.target.value);
  };

  return (
    <div>
      <div className="row positionCenterH1">
        <div className="dash-elements col-md-2">
          <a
            className="primary-btn "
            onClick={() => {
              setMyPropositions(true);
              setMyRequest(false);
            }}
          >
            My propositions
          </a>
        </div>

        <div className="dash-elements col-md-2">
          <a
            className="primary-btn "
            onClick={() => {
              setMyRequest(true);
              setMyPropositions(false);
            }}
          >
            My requests
          </a>
        </div>
      </div>

      {myPropositions && (
        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <table style={{ width: "100%" }} className="table  mb-0 ">
                  <thead>
                    <tr>
                      <th>
                        <h3>My product</h3>
                      </th>
                      <th>
                        <h3>Status</h3>
                      </th>
                      <th>
                        <h3>Amount</h3>
                      </th>
                      <th>
                        <h3>Product to exchange</h3>
                      </th>
                      <th>
                        <h3>Cancel</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myExchanges?.map((exchange, index) => (
                      <tr className="text-center" key={exchange._id}>
                        {/* <td className="product-remove">
                      <a>
                        <span
                          className="fa fa-close"
                          onClick={() => onSubmit(exchange._id)}
                        ></span>
                      </a>
                    </td> */}
                        <td className="image-prod" style={{ width: "30%" }}>
                          <img
                            className="img"
                            style={{ width: "200px", height: "200px" }}
                            src={exchange.productSender.picture[0]}
                          />

                          <h1 className="price">
                            {exchange?.productSender.name}{" "}
                          </h1>
                          <h3> {exchange?.productSender.price} DT</h3>

                          <td className="price">
                            {exchange?.productSender.description}
                          </td>
                        </td>

                        <td className="product-name" style={{ width: "10%" }}>
                          {exchange?.status == "ACTIVE" ? (
                            <h2>En attente</h2>
                          ) : (
                            <h2
                              style={{
                                color: "#DC143C",
                                lineHeight: "30px",
                              }}
                            >
                              {" "}
                              {exchange?.status}
                            </h2>
                          )}
                          {exchange.status == "CONFIRMED" ? (
                            <p>{format(exchange?.confirm.confirmedAt)}</p>
                          ) : (
                            <p>{format(exchange?.date)}</p>
                          )}
                        </td>

                        {!updateEx ? (
                          <td className="price" style={{ width: "10%" }}>
                            {exchange?.amount < 0 ? (
                              <h1
                                style={{
                                  color: "#DC143C",
                                  lineHeight: "30px",
                                }}
                              >
                                {exchange?.amount * -1}DT
                              </h1>
                            ) : (
                              <h1
                                style={{
                                  color: "#32CD32",
                                  lineHeight: "30px",
                                }}
                              >
                                {exchange?.amount}DT
                              </h1>
                            )}
                          </td>
                        ) : (
                          <td className="price" style={{ width: "10%" }}>
                            <input
                              required
                              onChange={(e) => {
                                handleChangeAmount(e);
                              }}
                              className="input"
                              type="text"
                              name="amount"
                              placeholder="Amount"
                            />
                          </td>
                        )}

                        <td className="image-prod" style={{ width: "30%" }}>
                          <img
                            style={{ width: "200px", height: "200px" }}
                            className="img"
                            src={exchange.productReciever.picture[0]}
                          />

                          <h1 className="price">
                            {exchange?.productReciever.name}
                          </h1>
                          <h3> {exchange?.productReciever.price} DT</h3>

                          <td className="price">
                            {exchange?.productReciever.description}
                          </td>
                          <button className="quick-view">
                            <Link
                              to={"/product/" + exchange?.productReciever?._id}
                            >
                              <i className="fa fa-eye"></i>
                              <span className="tooltipp">quick view</span>
                            </Link>
                          </button>
                        </td>

                        {exchange?.status == "ACTIVE" ? (
                          <td
                            className="product-remove"
                            style={{ width: "10%" }}
                          >
                            {!updateEx && (
                              <a>
                                <span
                                  className="fa fa-close"
                                  onClick={() => deleteExch(exchange?._id)}
                                ></span>
                              </a>
                            )}

                            <a>
                              <span
                                className="fa fa-refresh"
                                onClick={() => updateExch(exchange?._id)}
                              ></span>
                            </a>
                          </td>
                        ) : (
                          <td
                            className="product-remove"
                            style={{ width: "10%" }}
                          >
                            <a className="disabled">
                              <span
                                className="fa fa-close"
                                onClick={() => deleteExch(exchange?._id)}
                              ></span>
                            </a>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {myRequest && (
        <div className="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <table style={{ width: "100%" }} className="table  mb-0 ">
                  <thead>
                    <tr>
                      <th>
                        <h3>My product</h3>
                      </th>
                      <th>
                        <h3>Status</h3>
                      </th>
                      <th>
                        <h3>Amount</h3>
                      </th>
                      <th>
                        <h3>Product to exchange</h3>
                      </th>
                      <th>
                        <h3>Confirm</h3>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exchangesRequest?.map((exchange, index) => (
                      <tr className="text-center" key={exchange._id}>
                        {/* <td className="product-remove">
              <a>
                <span
                  className="fa fa-close"
                  onClick={() => onSubmit(exchange._id)}
                ></span>
              </a>
            </td> */}
                        <td className="image-prod" style={{ width: "30%" }}>
                          <img
                            style={{ width: "200px", height: "200px" }}
                            className="img"
                            src={exchange.productReciever.picture[0]}
                          />

                          <h1 className="price">
                            {exchange?.productReciever.name}
                          </h1>
                          <h3> {exchange?.productReciever.price} DT</h3>

                          <td className="price">
                            {exchange?.productReciever.description}
                          </td>
                        </td>

                        <td className="product-name" style={{ width: "10%" }}>
                          {exchange?.status == "ACTIVE" ? (
                            <h2>En attente</h2>
                          ) : (
                            <h2
                              style={{
                                color: "#DC143C",
                                lineHeight: "30px",
                              }}
                            >
                              {" "}
                              {exchange?.status}
                            </h2>
                          )}

                          {exchange.status == "CONFIRMED" ? (
                            <p>{format(exchange?.confirm.confirmedAt)}</p>
                          ) : (
                            <p>{format(exchange?.date)}</p>
                          )}
                        </td>

                        <td className="price" style={{ width: "10%" }}>
                          {exchange?.amount < 0 ? (
                            <h1
                              style={{
                                color: "#DC143C",
                                lineHeight: "30px",
                              }}
                            >
                              {exchange?.amount * -1}DT
                            </h1>
                          ) : (
                            <h1
                              style={{
                                color: "#32CD32",
                                lineHeight: "30px",
                              }}
                            >
                              {exchange?.amount}DT
                            </h1>
                          )}
                        </td>

                        <td className="image-prod" style={{ width: "30%" }}>
                          <img
                            className="img"
                            style={{ width: "200px", height: "200px" }}
                            src={exchange.productSender.picture[0]}
                          />

                          <h1 className="price">
                            {exchange?.productSender.name}{" "}
                          </h1>
                          <h3> {exchange?.productSender.price} DT</h3>

                          <td className="price">
                            {exchange?.productSender.description}
                          </td>
                          <button className="quick-view">
                            <Link
                              to={"/product/" + exchange?.productSender?._id}
                            >
                              <i className="fa fa-eye"></i>
                              <span className="tooltipp">quick view</span>
                            </Link>
                          </button>
                        </td>

                        {exchange?.status == "ACTIVE" ? (
                          <td
                            className="product-remove"
                            style={{ width: "10%" }}
                          >
                            <a>
                              <span
                                className="fa fa-check"
                                onClick={() => confirmExch(exchange?._id)}
                              ></span>
                            </a>

                            <a>
                              <span
                                className="fa fa-close"
                                onClick={() => declineExch(exchange?._id)}
                              ></span>
                            </a>
                          </td>
                        ) : (
                          <td
                            className="product-remove"
                            style={{ width: "10%" }}
                          >
                            <a className="disabled">
                              <span
                                className="fa fa-check"
                                onClick={() => confirmExch(exchange?._id)}
                              ></span>
                            </a>
                            <a className="disabled">
                              <span
                                className="fa fa-close"
                                onClick={() => declineExch(exchange?._id)}
                              ></span>
                            </a>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
