import React, {useState} from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import "./ForgotPasswordStyle.css";
import AuthService from "../AuthServices/auth.service";
import {useNavigate} from "react-router-dom";
import EventBus from "../AuthCommons/EventBus";
import {ToastContainer,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';

const ForgotPassword = (props) => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
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

      AuthService.ForgotPasswordEmail(email).then(
          (response) => {

              setLoading(false);
              setMessage(response.message);
              toast.success(response.message);

          },
          (error) => {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            toast.error(resMessage);
            setLoading(false);
            setMessage(resMessage);
          }
      );

      },
  });

  return (
      <div className="login-form">
          <ToastContainer />
          <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"> Email </label>
            <input
                name="email"
                type="email"
                className="form-control"
                onChange={formik.handleChange}
                value={formik.values.email}
            />
            <div className="text-danger">
              {formik.errors.email ? formik.errors.email : null}
            </div>
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block"  disabled={loading} id="bahabtn">
              {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Request password reset link</span>
            </button>

          </div>
          {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
          )}


        </form>
      </div>
  );

};

export default ForgotPassword;
