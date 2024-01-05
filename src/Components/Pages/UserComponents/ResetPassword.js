import React, {useEffect, useState} from "react";
import AuthService from "../AuthServices/auth.service";
import {useNavigate, useParams} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import * as Yup from "yup";
import {useFormik} from "formik";

const ResetPassword = (props) => {
  const { reset_token } = useParams();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
        )
        .required('Password is Required!'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    // validateOnChange: false,
    // validateOnBlur: false,
    onSubmit: (data) => {
      setLoading(true);
      setMessage("");

      const authData =JSON.stringify(data, null, 2);
      // console.log(authData);

      const password=data['password'];

      AuthService.ResetPassword(reset_token,password).then(
          (response) => {

            setLoading(false);
            setMessage(response.message);
            toast.success(response.message);
            const timer = setTimeout(() => {
              navigate("/auth", { state: { message: "Ok" } });
              window.location.reload(false);
            }, 5000);
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
      <header className="jumbotron">
        <h3>
          <strong>Account Reset!</strong>
        </h3>
      </header>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="password"> Password </label>
          <input
              name="password"
              type="password"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.password}
          />
          <div className="text-danger">
            {formik.errors.password ? formik.errors.password : null}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword"> Confirm Password  </label>
          <input
              name="confirmPassword"
              type="password"
              className="form-control"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
          />
          <div className="text-danger">
            {formik.errors.confirmPassword ? formik.errors.confirmPassword : null}
          </div>
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block"  disabled={loading} id="bahabtn">
            {loading && (
                <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Reset Password</span>
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

export default ResetPassword;
