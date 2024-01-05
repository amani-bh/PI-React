import React, { useContext, useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import NavBarAuth from "./NavBarAuth";
import AuthService from "../AuthServices/auth.service";


export default function Headers() {


  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();


  useEffect(async () => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);

      if(user.role[0]==="ROLE_ADMIN" || user.role[0]==="ROLE_SUPER_ADMIN")
      {
        window.open('http://localhost:3002',"_self");
      }
      else{
        navigate("/", { state: { message: "Ok" } });
      }

    }


  }, []);

  return (
    <>
      <header>
        <div id="top-header">
          <div className="container">
            <ul className="header-links pull-left">
              <li>
                <a href="#">
                  <i className="fa fa-phone"></i> +021-95-51-84
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-envelope-o"></i> email@email.com
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
                  <i className="fa fa-dollar"></i> USD
                </a>
              </li>

                  <li><Link to="signin"  >SignIn/SignUp</Link></li>



            </ul>
          </div>
        </div>

        <div id="header">
          <div className="container">
            <div className="row">
              <div className="col-md-6" style={{ marginLeft:'40%' }}>
                <div className="header-logo">
                  <a href="#" className="logo">
                    <img src="./img/logo.png" alt=""  />
                  </a>
                </div>
              </div>



              <div className="col-md-3 clearfix">
                <div className="header-ctn">






                </div>
              </div>



            </div>
          </div>
        </div>
      </header>
      <NavBarAuth />
    </>
  );
}
