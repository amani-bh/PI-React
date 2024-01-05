import React, {useEffect} from "react";
import AuthService from "../AuthServices/auth.service";
import {useNavigate, useParams} from "react-router-dom";

const Welcome = (props) => {
  const { verify_token } = useParams();
  const navigate = useNavigate();


  useEffect( () => {
    if (verify_token) {
      AuthService.verifyUser(verify_token).then(r => {

      });
        const timer = setTimeout(() => {
            navigate("/auth", { state: { message: "Ok" } });
            window.location.reload(false);
        }, 2000);
    }

  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>Account confirmed!</strong>
        </h3>
      </header>

    </div>
  );
};

export default Welcome;
