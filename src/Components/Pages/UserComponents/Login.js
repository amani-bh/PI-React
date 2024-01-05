import React, {useState} from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import "./LoginStyle.css";
import AuthService from "../AuthServices/auth.service";
import {Link, useNavigate} from "react-router-dom";
import EventBus from "../AuthCommons/EventBus";
import Google from './Google';
import TokenService from "../AuthServices/auth-token.service";
import WebcamCapture from './webcam.js';

const Login = (props) => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
        .required("Password is required")
        .min(3, "Password must be at least 3 characters")
        .max(10, "Password must not exceed 10 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: (data) => {
      setLoading(true);
      setMessage("");

      const authData =JSON.stringify(data, null, 2);
     // console.log(authData);

      const email=data['email'];
      const password=data['password'];

      AuthService.login(email, password).then(
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

      },
  });

  const informParent = response => {
  //  console.log("page login");
  //console.log(response.data);
  //console.log(response.data)
    TokenService.setUser(response.data);
    if(response.data.role[0]==="ROLE_ADMIN"){//console.log("admin");
    }
  else if(response.data.role[0]==="ROLE_DELIVERY_MAN"){//console.log("ROLE_DELIVERY_MAN");
  }
  else{navigate("/home", { state: { message: "Ok" } });}
  };

  return (
    <>
    <section class="ftco-section">
		<div class="container">
		
			<div class="row justify-content-center">
				<div class="col-md-12 col-lg-10">
					<div class="wrap d-md-flex">
						<div class="img" >
			      </div>
						<div class="login-wrap p-4 p-md-5">
			      	<div class="d-flex">
			      		<div class="w-100">
			      			<h3 class="mb-4">Sign In</h3>
			      		</div>
							
			      	</div>
							<form onSubmit={formik.handleSubmit} class="signin-form">
			      		<div class="form-group mb-3">
			      			<label class="label" htmlFor="email">Email</label>
                  <input  name="email" placeholder='Email' type="email" className="form-control" onChange={formik.handleChange}  value={formik.values.email}  /><div className="text-danger">
                     {formik.errors.email ? formik.errors.email : null}
                 </div>
			      		</div>
		            <div class="form-group mb-3">
		            	<label class="label" htmlFor="password">Password</label>
		              <input name="password" placeholder='Password' type="password"  className="form-control"  onChange={formik.handleChange}  value={formik.values.password} />
                  <div className="text-danger">
                     {formik.errors.password ? formik.errors.password : null}
                   </div>
                </div>


                <div className="form-group">
                  <button type="submit" class="form-control btn btn-primary rounded submit  col-11"  disabled={loading} id="bahabtn">
                {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}
                Login
              </button>
              
            </div>
                  {message && (
                      <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                          {message}
                        </div>
                      </div>
                  )}
                  <div className="col-11 ml-2">
                  <Google informParent={informParent} />
                  </div>
                  <WebcamCapture/>
		            
		            <div class="form-group d-md-flex">
		            	<div class="w-50 text-left">
			            	<label class="checkbox-wrap checkbox-primary mb-0">Remember Me
									  <input type="checkbox" checked/>
									  <span class="checkmark"></span>
										</label>
									</div>
									<div class="w-50 text-md-right">
                  <Link to="/auth/forgot" id="bahalink">
                    Forgot Password
                  </Link>
									
									</div>
                  
		            </div>
                
                {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
          )}
		          </form>
		          <p class="text-center">Not a member? <a data-toggle="tab" href="/auth/signup" className='tab-signup'>Sign Up</a></p>
		        </div>
                 
                
             
		      </div>
				</div>
			</div>
		</div>
	
</section>
	
      </>
  );

};

export default Login;
