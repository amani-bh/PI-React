import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./nav.css";
import AuthService from "../Pages/AuthServices/auth.service";

export default function NavBar() {
  const [tog, setTog] = useState(true);
  //var id_user = localStorage.getItem("id");

  var id_user = AuthService.getCurrentUser().id;

  window.addEventListener("resize", function () {
    if (window.innerWidth > 600) setTog(true);
    else setTog(false);
  });

  const [showClientContent, setshowClientContent] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(async () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);

      setshowClientContent(user ? true : false);
      id_user = AuthService.getCurrentUser().id;
    }
  }, []);

  return (
    <nav
      id="navigation"
      className="navbar aymen-navbar navbar-expand-lg navbar-light"
    >
      <button
        onClick={() => {
          setTog(!tog);
        }}
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="container">
        {tog && (
          <div id="navbarNavAltMarkup">
            <ul className="main-nav nav navbar-nav aymen-ul">
              <li className=" nav-item">
                <Link className=" aymen-nav" to="home">
                  Home
                </Link>
              </li>
              <li className=" nav-item ">
                <Link className=" aymen-nav" to="abouts">
                  About us
                </Link>
              </li>
              <li className=" nav-item ">
                <Link className=" aymen-nav" to="shop">
                  Shop
                </Link>
              </li>
              {id_user != null && (
                <li className=" nav-item ">
                  <Link className=" aymen-nav" to="monitoring-delivery">
                    Monitoring orders
                  </Link>
                </li>
              )}
              <li className=" nav-item ">
                <Link className=" aymen-nav" to="auction">
                  Auction
                </Link>
              </li>
              {id_user != null && (
                <li className=" nav-item ">
                  <Link className=" aymen-nav" to="user-product">
                    Sell
                  </Link>
                </li>
              )}

              {id_user != null && (
                <li className=" nav-item ">
                  <Link className=" aymen-nav" to="userExchanges">
                    Exchanges
                  </Link>
                </li>
              )}

              {id_user != null && (
                <li className=" nav-item ">
                  <Link className=" aymen-nav" to="userTransactions">
                    Transactions
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
