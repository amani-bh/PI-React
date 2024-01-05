import React, {useState} from 'react';
import { useFormik } from "formik";
import * as Yup from 'yup';
import "./SignupStyle.css";
import AuthService from "../AuthServices/auth.service";
import {useNavigate} from "react-router-dom";
import EventBus from "../AuthCommons/EventBus";
import UserService from "../AuthServices/user.service";
import {ToastContainer,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import axios from "axios";

const SignUp = (props) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const phoneRegExp = '^((5|9|2)[0-9]{7})$'

  const validationSchema = Yup.object().shape({
    firstname: Yup.string()
        .required('Firstname is required')
        .min(3, 'Firstname must be at least 3 characters')
        .max(10, 'Firstname must not exceed 10 characters'),
    lastname: Yup.string()
        .required('Lastname is required')
        .min(3, 'Lastname must be at least 3 characters')
        .max(10, 'Lastname must not exceed 10 characters'),
    phone_number: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .required('Phone number is required'),
    address: Yup.string()
        .required('Address is required')
        .min(3, 'Address must be at least 3 characters')
        .max(20, 'Address must not exceed 20 characters'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
        )
        .required('Password is Required!'),
    confirmPassword: Yup.string()
        .required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required'),
    flaskimage: Yup.string().matches("cb",'Verify Image Policy ').required('Verify Image Policy '),

  })
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    address: '',
    phone_number: 0,
    picture: '',
    email: '',
    password: '',
  })
  const [item, setItem] = useState({ title: '', image: '' })
  const [fileData, setFileData] = useState()

  const [images, setFile] = useState('')
  const [preview, setPreview] = useState('')

  const handleFileChange = ({ target }) => {
    setFileData(target.files[0])
    setFile(target.value)
    //console.log(fileData)
    //console.log(images)
    //console.log(target.files[0])
    previewFile(target.files[0])


    const formData = new FormData()
    formData.append("file", target.files[0]);
    axios.post('https://pi-flask-obscenegestureai.herokuapp.com/Image/Verify/', formData,{ headers: {
   'Content-Type': 'multipart/form-data'
  }}
)
        .then(function (response) {
          //console.log(response);
          setFlaskimage(response.data);
          if(response.data==="Image doesn't contains hands at all")
          {
            formik.values.flaskimage="cb";
            //console.log("cbcb");
          }
          else if(response.data==="Normal hand")
          {
            formik.values.flaskimage="cb";
            //console.log("cbcb");
          }
          else {
            formik.values.flaskimage="";
            //console.log("nnnnnnnnnnn");
          }
        })
        .catch(function (error) {
          //console.log(error);
          //setFlaskimage(error);
        });
  }
  const [flaskimage, setFlaskimage] = useState('')

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreview(reader.result)
    }
  }
  var formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      address: '',
      phone_number: '',
      picture: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      flaskimage:'',
    },
    validationSchema,
    // validateOnChange: true,
    // validateOnBlur: false,
    onSubmit: (data) => {
      setLoading(true)
      setMessage('')

      var userData = JSON.stringify(data, null, 2)

      const firstname = data['firstname']
      const lastname = data['lastname']
      const address = data['address']
      const phone_number = data['phone_number']
      const email = data['email']
      const password = data['password']
      const picture = fileData
      const role = 'CLIENT'

      var datafinale = {
        firstname: firstname,
        lastname: lastname,
        address: address,
        phone_number: phone_number,
        email: email,
        password: password,
        picture: picture,
        role: role,
      }

      const formdata = new FormData()
      formdata.append('firstname', firstname)
      formdata.append('lastname', lastname)
      formdata.append('address', address)
      formdata.append('phone_number', phone_number)
      formdata.append('email', email)
      formdata.append('password', password)
      formdata.append('role', role)
      //formdata.append('status', 'VERIFIED')
      formdata.append('picture', fileData)
      //console.log('formdata', formdata)

      UserService.create(formdata).then(
          (data) => {
            //console.log(data);
            // alert(data.role[0]);
            toast.success(`Email has been sent to ${email}. Follow the instruction to activate your account`);
            const timer = setTimeout(() => {
              navigate("/auth", { state: { message: "Ok" } });
            }, 5000);
            // window.location.reload();
          },
          (error) => {
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            toast.error(resMessage);
            setLoading(false)
            setMessage(resMessage)
          },
      )
    },
  })

  return (
    <div class="main">

    <section class="signup">
        <div class="container">
            <div class="signup-content">
                <form method="POST" id="signup-form" class="signup-form">
                <ToastContainer />
                    <h2 class="form-title">Create account</h2>
                    <div class="form-group">
                        <input name="firstname"  type="firstname" class="form-input"  id="name" placeholder="Your Firstname"  onChange={formik.handleChange} value={formik.values.firstname}/>
                        <div className="text-danger">
                         {formik.errors.firstname ? formik.errors.firstname : null}
                      </div>
                    </div>
                    <div class="form-group">
                        <input name="lastname"  type="lastname"  class="form-input" id="email" placeholder="Your Lastname"  onChange={formik.handleChange}    value={formik.values.lastname}/>
                        <div className="text-danger">
                           {formik.errors.lastname ? formik.errors.lastname : null}
                         </div>
                    </div>
                    <div class="form-group">
                        <input  name="address"   type="address" class="form-input"   id="password" placeholder="Your Address"  onChange={formik.handleChange} value={formik.values.address}/>
                        <div className="text-danger">
                          {formik.errors.address ? formik.errors.address : null}
                        </div>
                        </div>
                    <div class="form-group">
                        <input  name="phone_number"  type="number" class="form-input" id="re_password" placeholder="Your Phone Number" onChange={formik.handleChange}  value={formik.values.phone_number  }/>
                        <div className="text-danger">
                          {formik.errors.phone_number ? formik.errors.phone_number : null}
                        </div>
                    </div>
                    <div class="form-group">
                        <input   name="email" type="email" class="form-input" id="re_password" placeholder="Your Email" onChange={formik.handleChange}  value={formik.values.email  }/>
                        <div className="text-danger">
                          {formik.errors.email ? formik.errors.email : null}
                        </div>
                    </div>
                    <div class="form-group">
                        <input  name="password"  type="password" class="form-input" id="re_password" placeholder="Your Password" onChange={formik.handleChange}  value={formik.values.password  }/>
                        <div className="text-danger">
                          {formik.errors.password ? formik.errors.password : null}
                        </div>
                    </div>
                    <div class="form-group">
                        <input   name="confirmPassword"  type="password" class="form-input" id="re_password" placeholder="Confirm Your Password" onChange={formik.handleChange}  value={formik.values.confirmPassword  }/>
                        <div className="text-danger">
                          {formik.errors.confirmPassword ? formik.errors.confirmPassword : null}
                        </div>
                    </div>
                    
                    <div className="form-group ml-5">
                        <label htmlFor="picture"> Picture </label>
                        <br/>


                          <label htmlFor="upload-button">
                            {preview ? (
                                <img src={preview} alt="dummy" width="150" height="150" />
                            ) : (
                                <>
                        <span className="fa-stack fa-2x mt-3 mb-2">
                          <i className="fas fa-circle fa-stack-2x" />
                          <i className="fas fa-image fa-stack-1x fa-inverse" />
                        </span>
                                  <h5 className="text-center">Upload your photo</h5>
                                </>
                            )}
                          </label>
                          {flaskimage? (<p> {flaskimage} </p>):(<p>...</p>) }
                        <div className="text-danger">
                          {formik.errors.flaskimage ? formik.errors.flaskimage : null}
                        </div>
                          <input
                              className="custom-file-input"
                              type="file"
                              name="picture"
                              value={images}
                              accept="image/*"
                              onChange={handleFileChange}
                              draggable
                          />
                     </div>
                     <div class="form-group">
                        <input name="acceptTerms"  type="checkbox" id="agree-term" class="agree-term"  onChange={formik.handleChange}   value={formik.values.acceptTerms} />
                        <label for="agree-term" class="label-agree-term"><span><span></span></span>I have read and agree to the Terms </label>
                        <div className="text-danger">
                          {formik.errors.acceptTerms ? formik.errors.acceptTerms : null}
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" name="submit" id="submit" class="form-submit"  disabled={loading}>
                        {loading && (
                              <span className="spinner-border spinner-border-sm"></span>
                          )}  Sign up
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
                <p class="loginhere">
                    Have already an account ? <a href="/auth/signin" class="loginhere-link">Login here</a>
                </p>
            </div>
        </div>
    </section>

</div>
  );

};

export default SignUp;
