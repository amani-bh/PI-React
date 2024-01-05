import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "./navAuth.css";

export default function NavBarAuth() {
  const [tog, setTog] = useState(true);

  window.addEventListener("resize", function () {
    if (window.innerWidth > 600) setTog(true);
    else setTog(false);
  });

  return (
    <nav
      id="navigation"
      className="navbar baha-navbar navbar-expand-lg navbar-light"
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
            <ul className="main-nav nav navbar-nav baha-ul">
              <li className=" nav-item">
                <Link className=" baha-nav" to="signin">
                  SignIn
                </Link>
              </li>
              <li className=" nav-item ">
                <Link className=" baha-nav" to="signup">
                  SignUp
                </Link>
              </li>

            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
