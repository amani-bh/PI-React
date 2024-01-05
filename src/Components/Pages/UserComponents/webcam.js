import React, {useState} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import "./LoginStyle.css";
import AuthService from "../AuthServices/auth.service";
import {useNavigate} from "react-router-dom";

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const videoConstraints = {
    width : 200,
    height : 200,
    facingMode: 'user'
  };

  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

  const[email, setEmail] = useState('')
  const capture = React.useCallback(
  () => {
    const imageSrc = webcamRef.current.getScreenshot();
    //console.log(`imageSrc = ${imageSrc}`)
                //for deployment, you should put your backend url / api
    axios.post('https://pi-flask-facerecognitionai.herokuapp.com/send-image/', {data : imageSrc},{ headers: {
            'Access-Control-Allow-Origin': '*'
        }})
    	  .then(res => {
      	  //console.log(`response = ${res.data}`)
              setEmail(res.data)

              AuthService.loginFace(res.data).then(
                  (data) => {
                      //console.log(data);
                      // alert(data.role[0]);
                      if(data.role[0]==="ROLE_DELIVERY_MAN"){
                          // alert(data.role[0]);
                          // navigate("delivery", { state: { message: "Ok" } });
                          navigate("../../delivery/home", { replace: true });
                      }
                      else if(data.role[0]==="ROLE_ADMIN"){
                          navigate("/home", { state: { message: "Ok" } });
                      }
                      else{
                          navigate("/home", { state: { message: "Ok" } });
                      }
                      // window.location.reload();
                  },
                  (error) => {
                      const resMessage =
                          (error.response &&
                              error.response.data &&
                              error.response.data.message) ||
                          error.message ||
                          error.toString();

                      setLoading(false);
                      setMessage(resMessage);
                  }
              );


    })
    	  .catch(error => {
      	  //console.log(`error = ${error}`)
    })
  }, 
   [webcamRef]
  );
  
  return (
  <>
    <Webcam
     audio = {false}
	 height = {100}
	 ref = {webcamRef}
	 screenshotFormat = "image/jpeg"
	 width = {150}
	 videoConstraints = {videoConstraints}
	/>

    <button onClick={capture} disabled={loading}    className=" btn btn-primary rounded submit px-3 col-3 webcam-face-id"    >
        {loading && (
            <span className="spinner-border spinner-border-sm"></span>
        )}
        Face ID
    </button>

	<h2 style={{ marginLeft:"12%" }}>{email}</h2>
      {message && (
          <div className="form-group">
              <div className="alert alert-danger" role="alert">
                  {message}
              </div>
          </div>
      )}

  </>
	);
  
};

export default WebcamCapture;
