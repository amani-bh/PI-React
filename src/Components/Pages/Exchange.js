import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthServices/auth.service"



export default function Exchange(props) {
  const [allProductsToExchange, setAllProductsToExchange] = useState([]);
  const [addAmount, setAddAmount] = useState(null);
  const [amount, setAmount] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    allProductsToExchange.push(
      props.myProductToExchange,
      props.productToExchange
    );
  }, []);

  const handlePosition = async (event) => {
    setAddAmount(event.target.value);
    console.log(event.target.value);
  };
  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const onSubmit = async (e) => {
    const exchange = {
      userReciever: props.productToExchange.seller,
      userSender: AuthService.getCurrentUser().id,
      productReciever: props.productToExchange,
      productSender: props.myProductToExchange,
      amount: amount,
    };

    if (addAmount == "request") {
      exchange.amount = amount * -1;
    }
    if (addAmount == "add") {
      exchange.amount = amount * 1;
    }

    console.log(exchange);

    const res = await axios.post(
      `${process.env.REACT_APP_URI}/exchange/add`,
      exchange
    );
    navigate("userExchanges");

    //if (res.data.message != "False") navigate("../shop", { replace: true });
  };

  return (
    <div>
      <div className="container">
        <div className="col-md-12">
          <div className="row">
            <div
              className="col-md-1 col-xs-6"
              data-aos="fade-in"
              key={props.myProductToExchange?._id}
            ></div>

            <div
              className="col-md-5 col-xs-6"
              data-aos="fade-in"
              key={props.myProductToExchange?._id}
            >
              <h1 className="positionCenterH1">My product</h1>

              <div className="product">
                <div className="product-img">
                  <img
                    className="dimensionsImg"
                    src={props.myProductToExchange?.picture[0]}
                    alt=""
                  />
                  {props.myProductToExchange?.sold === true ? (
                    <div className="product-label">
                      <span className="new">Sold</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="product-body">
                  <p className="product-category">
                    {props.myProductToExchange?.category}
                  </p>
                  <h3 className="product-name">
                    <Link to={"/product/" + props.myProductToExchange?._id}>
                      {props.myProductToExchange?.name}
                    </Link>
                  </h3>
                  <h4 className="product-price">
                    {props.myProductToExchange?.price} DT
                  </h4>
                  <div className="product-rating"></div>
                  <div className="product-btns">
                    {props.myProductToExchange?.sold === false ? (
                      <button className="add-to-wishlist">
                        <Link
                          to={
                            "/update-product/" + props.myProductToExchange?._id
                          }
                        >
                          <i className="fa fa-pen"></i>
                          <span className="tooltipp">Update product</span>
                        </Link>
                      </button>
                    ) : (
                      <></>
                    )}

                    <button className="quick-view">
                      <Link to={"/product/" + props.myProductToExchange?._id}>
                        <i className="fa fa-eye"></i>
                        <span className="tooltipp">quick view</span>
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col-md-1 col-xs-6"
              data-aos="fade-in"
              key={props.myProductToExchange?._id}
            ></div>

            <div
              className="col-md-5 col-xs-6"
              data-aos="fade-in"
              key={props.productToExchange?._id}
            >
              <h1 className="positionCenterH1">For exchange</h1>

              <div className="product">
                <div className="product-img">
                  <img
                    className="dimensionsImg"
                    src={props.productToExchange?.picture[0]}
                    alt=""
                  />
                  {props.productToExchange?.sold === true ? (
                    <div className="product-label">
                      <span className="new">Sold</span>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="product-body">
                  <p className="product-category">
                    {props.productToExchange?.category}
                  </p>
                  <h3 className="product-name">
                    <Link to={"/product/" + props.productToExchange?._id}>
                      {props.productToExchange?.name}
                    </Link>
                  </h3>
                  <h4 className="product-price">
                    {props.productToExchange?.price} DT
                  </h4>
                  <div className="product-rating"></div>
                  <div className="product-btns">
                    <button className="quick-view">
                      <Link to={"/product/" + props.productToExchange?._id}>
                        <i className="fa fa-eye"></i>
                        <span className="tooltipp">quick view</span>
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className="positionCenterH1" onSubmit={onSubmit}>
        <div className="form-group">
          <div className="col-md-8">
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
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <select className="input" onChange={handlePosition}>
              <option value="add">Add amount </option>
              <option value="request">Request amount</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <div className="col-md-12">
            <button className="primary-btn order-submit">Confirm</button>
          </div>
        </div>
      </form>
    </div>
  );
}
