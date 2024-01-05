import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartById, RemoveProductFromCard } from "../../Utils/Cart";
import { queryServerApi } from "../../Utils/queryServerApi";
import { SocketContext } from "../../Utils/socketContext";
import { getProductsWishlist } from "../../Utils/Product";
import { seenConversation } from "../../Utils/Message";

import { getChats } from "../../Utils/Chat";

import axios from "axios";
import NavBar from "./NavBar";
import AuthService from "../Pages/AuthServices/auth.service";
import EventBus from "../Pages/AuthCommons/EventBus";
import "./headerUser.css";
import img from "../../ComponentsDeliveryOffice/OrderForm/UtilOrder/logo.png";
import { motion } from "framer-motion";
import { GetBalance } from "../../Utils/Blockchain";

export default function Headers() {
  const { socket } = useContext(SocketContext);

  const [showDeliveryContent, setShowDeliveryContent] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const userLogOut = () => {
    EventBus.dispatch("logout");
  };
  const userProfile = () => {
    navigate("/profile", { state: { message: "Ok" } });
  };
  const [settings, setSettings] = useState(false);

  //const id_user = localStorage.getItem("id");
  const id_user = AuthService.getCurrentUser().id;

  let total = 0;
  const [cart, setCart] = useState([]);
  const [user, Setuser] = useState({});
  const [cost, setCost] = useState(0);
  const [conversations, setConversations] = useState(0);
  const [unseen, setUnseen] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balancechange, setBalancechange] = useState(false);

  const nbr = cart?.products?.length;

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      //  setShowDeliveryContent(user.role.equals("ROLE_DELIVERY_MAN"));
    }
  }, []);

  useEffect(async () => {
    if (id_user) {
      const [data, err] = await queryServerApi("user/findone/" + id_user);
      Setuser(data);
      const amount = await GetBalance(data.publicKey);

      setBalance(amount);

      const fetchData = async () => {
        const result = await getCartById(id_user);
        window.localStorage.setItem("id_cart", result._id);
        setCart(result.products);
        console.log(data);
      };
      fetchData();
      socket.on("deleteProd", (data) => {
        setCart([]);
      });
      socket.on("sendCart", (data) => {
        console.log(data.ctn);
        setCart((d) => [...d, data.ctn]);
      });
    }
  }, []);
  useEffect(async () => {
    socket.on("getWallet", (res) => {
      setBalancechange(!balancechange);
    });
  });

  useEffect(async () => {
    const amount = await GetBalance(user.publicKey);

    setBalance(amount);
    console.log(balancechange);
  }, [balancechange]);

  const onSubmit = async (e) => {
    const result = await RemoveProductFromCard(id_user, e);
    setCart(
      Object.values(cart).filter((dr) => {
        return dr._id != e;
      })
    );
  };
  /* wishlist */
  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductsWishlist(id_user);
      setWishlist(result);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      var i = 0;
      try {
        const result = getChats(id_user);
        result.then(function (result) {
          result.map((element) => {
            const resulteenConversation = seenConversation(
              element._id,
              id_user
            );
            resulteenConversation.then(function (res) {
              if (!res) {
                i++;
                setUnseen(i);
              }
            });
          });
        });
        setConversations(result);
      } catch (err) {
        console.log(err.Message);
      }
    };
    getConversations();
  }, [id_user]);
  return (
    <>
      <header style={{ zIndex: 0 }}>
        <div id="top-header">
          <div className="container">
            <ul className="header-links pull-left">
              <li>
                <a href="#">
                  <i className="fa fa-phone"></i> 71 555 111
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-envelope-o"></i> techtak@techtak.tn
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-map-marker"></i> 1734 Stonecoal Road
                </a>
              </li>
            </ul>
            <ul className="header-links pull-right">
              <li>
                <a href="#">
                  <i className="fa fa-dollar"></i> Coins
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    setSettings(!settings);
                  }}
                  className="UserLink"
                >
                  {" "}
                  <img className="UserAvatar" src={user?.picture} />
                  {user?.firstname}
                </a>
                {settings && (
                  <motion.ul
                    className=""
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                  >
                    <li>
                      <a href="" onClick={userProfile}>
                        My Profile
                      </a>
                    </li>
                    <li>
                      <a href="" onClick={userLogOut}>
                        Logout
                      </a>
                    </li>
                  </motion.ul>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div id="header">
          <div className="container">
            <div className="row">
             
              <div className="col-md-2">
                <div className="header-logo">
                  <a href={"/home"} className="logo">
                    <img src="./img/logo.png" alt="" />
                  </a>
                </div>
              </div>

              <div className="col-md-5">
                <div className="header-search">
                  <form>
                    <select className="input-select">
                      <option value="0">All Categories</option>
                      <option value="1">Category 01</option>
                      <option value="1">Category 02</option>
                    </select>
                    <input className="input" placeholder="Search here" />
                    <button style={{ height: "41.5px" }} className="search-btn">
                      Search
                    </button>
                  </form>
                </div>
              </div>

              <div className="col-md-4 clearfix">
                <div className="header-ctn">
                  <div>
                    <a href="#">
                      <i className="fas  fa-coins    "></i>

                      <span>Wallet</span>
                      <div className="qty">{balance?.balance}</div>
                    </a>
                  </div>

                  <div>
                    <a href={"/wishlist"}>
                      <i className="fa fa-heart-o"></i>
                      <span>Your Wishlist</span>
                      {cart?.length > 0 ? (
                        <div className="qty">{wishlist?.length}</div>
                      ) : (
                        <div className="qty">0</div>
                      )}
                    </a>
                  </div>

                  <div className="dropdown">
                    <a
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="true"
                      href={"/cart"}
                    >
                      <i className="fa fa-shopping-cart"></i>
                      <span>Your Cart</span>
                      <div className="cart-dropdown">
                        <div className="cart-list"></div>
                        <div className="cart-summary">
                          <small>{nbr} Item(s) selected</small>
                          <h5>SUBTOTAL: {total}</h5>
                        </div>
                        <div className="cart-btns">
                          <a href={"/cart"}>View Cart</a>
                          <Link to="checkout">
                            Checkout{" "}
                            <i className="fa fa-arrow-circle-right"></i>
                          </Link>
                        </div>
                      </div>
                      {cart?.length > 0 ? (
                        <div className="qty">{cart?.length}</div>
                      ) : (
                        <div className="qty">0</div>
                      )}
                    </a>
                    <div className="cart-dropdown">
                      <div className="cart-list">
                        {cart?.map((product) => (
                          <div className="product-widget" key={product._id}>
                            <div className="product-img">
                              <img src={product.picture[0]} alt="" />
                            </div>
                            <div className="product-body">
                              <h3 className="product-name">
                                <a href="#">{product.name}</a>
                              </h3>
                              <h4 className="product-price">
                                {product.price}DT
                                <p hidden>{(total += product.price)}</p>
                              </h4>
                            </div>
                            <button
                              className="delete"
                              onClick={() => onSubmit(product._id)}
                            >
                              <i className="fa fa-close"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="cart-summary">
                        <small>{nbr} Item(s) selected</small>
                        <h5>SUBTOTAL: {total}</h5>
                      </div>
                      <div className="cart-btns">
                        <a href={"/cart"}>View Cart</a>
                        <Link to="checkout">
                          Checkout <i className="fa fa-arrow-circle-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a href={"/messenger"}>
                      <i className="far fa-comment"></i>
                      {unseen != 0 && <div className="qty">{unseen}</div>}
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-1">
                <div className="header-logo">
                  <a className="logo">
                    <img src="./img/techcoins.png" alt="" />
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </header>
      <NavBar />
    </>
  );
}
