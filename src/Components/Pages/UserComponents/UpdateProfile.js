import React, {useEffect, useState} from "react";
import AuthService from "../AuthServices/auth.service";
import "./UpdateProfileStyle.css";
import UserService from "../AuthServices/user.service";
import {useNavigate} from "react-router-dom";
import EventBus from "../AuthCommons/EventBus";
import * as Yup from "yup";
import {useFormik} from "formik";

const UpdateProfile = () => {
    const currentUser = AuthService.getCurrentUser();
    const [content, setContent] = useState("");
    const [userinfo, Setuserinfo] = useState({});

    const getUserInfo = id => {
        UserService.getUserInfo(id)
            .then(response => {
                Setuserinfo(response.data);
                //   console.log(response.data);
            })
            .catch(e => {
                //console.log(e);
            });
    };

    useEffect(() => {
        UserService.getClientContent().then(
            (response) => {
                setContent(response.data);
                getUserInfo(currentUser.id);
                //


                //
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setContent(_content);
                //403 navigate page 404 maybe !
                if (error.response && error.response.status === 403 ) {
                    // EventBus.dispatch("logout");
                }


            }
        );

    }, []);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const phoneRegExp = '^((5|9|2)[0-9]{7})$';

    const validationSchema = Yup.object().shape({

        phone_number: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required('Phone number is required'),
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
            )
            .required("Password is Required!"),
        confirmPassword: Yup.string()
            .required('Confirm Password is required')
            .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
        acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required'),
    });

    const [user, setUser] = useState({
        _id: '',
        picture: '',
        email: '',
        password: '',
        phone_number:0 ,
    });
    const [item, setItem] = useState({ title: '', image: '' });
    const [fileData, setFileData] = useState()

    const [images, setFile] = useState('')
    const [preview, setPreview] = useState('')

    const handleFileChange = ({ target }) => {
        setFileData(target.files[0])
        setFile(target.value)
        // console.log(fileData)
        previewFile(target.files[0])
    }
    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreview(reader.result)
        }
    }
    var formik = useFormik({

    initialValues: {
            picture:'',
            phone_number: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
        validationSchema,
        // validateOnChange: true,
        // validateOnBlur: false,
        onSubmit: (data) => {
            setLoading(true);
            setMessage("");

            var userData =JSON.stringify(data, null, 2);
            //console.log(userData);
            //console.log(item);



            const email=data['email'];
            const phone_number=data['phone_number'];
            const password=data['password'];
            const picture=item.image;
            //console.log(picture);

            currentUser.email=email;
            currentUser.phone_number=phone_number;
            currentUser.password=password;
            currentUser.picture=picture;

            //userData.picture=item.image;
            delete currentUser.accessToken;
            delete currentUser.refreshToken;
            delete currentUser.role;
            delete currentUser.username;
            delete currentUser.accessToken;
         //   userData.picture='picture' ;
            //console.log(currentUser);

            const formdata = new FormData()
            formdata.append('_id', currentUser.id)
            formdata.append('phone_number', currentUser.phone_number)
            formdata.append('email', currentUser.email)
            formdata.append('password', currentUser.password)
            // formdata.append('status', status)
            formdata.append('picture', fileData)
            //  console.log('formdata', formdata)

             UserService.updateProfile(currentUser.id, formdata).then(
                (data) => {
                    //console.log(data);
                    // alert(data.role[0]);
                        navigate("/profile", { state: { message: "Ok" } });

                     window.location.reload(false);
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




    return(
        <div className="container">
            <div className="baha-main-body">
                <form  onSubmit={formik.handleSubmit}>


                <div className="row baha-gutters-sm">
                    <div className="col-md-4 baha-mb-3">
                        <div className="baha-card">
                            <div className="baha-card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img src={userinfo.picture } alt="Admin"
                                         className="rounded-circle" width="150"></img>
                                        <div className="mt-3">
                                            <h4>{userinfo.username}</h4>
                                            <p className="text-secondary mb-1">{userinfo.firstname} {userinfo.lastname}</p>
                                            <p className="text-muted font-size-sm">{userinfo.role }</p>
                                            <button className="btn btn-primary" style={{backgroundColor : "#5b2a93"}} >Follow</button>
                                            <button className="btn btn-outline-primary" id="bahabg" >Message</button>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="baha-card baha-mb-3">
                            <div className="baha-card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Picture</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">

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
                                </div>
                                <hr></hr>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email </h6>

                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            <div className="form-group">
                                                <input
                                                    name="email"
                                                    type="email"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    value={formik.values.email  }
                                                />
                                                <div className="text-danger">
                                                    {formik.errors.email ? formik.errors.email : null}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <hr></hr>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">phone_number </h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <div className="form-group">
                                            <input
                                                name="phone_number"
                                                type="number"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                value={formik.values.phone_number  }
                                            />
                                            <div className="text-danger">
                                                {formik.errors.phone_number ? formik.errors.phone_number : null}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                        <hr></hr>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">password  </h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <div className="form-group">
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
                                    </div>

                                </div>
                                            <hr></hr>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Confirm Password  </h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        <div className="form-group">
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
                                    </div>

                                </div>
                                <hr></hr>
                                <div className="form-group form-check">
                                    <input
                                        name="acceptTerms"
                                        type="checkbox"
                                        className="form-check-input"
                                        onChange={formik.handleChange}
                                        value={formik.values.acceptTerms}
                                    />
                                    <label htmlFor="acceptTerms" className="form-check-label">
                                        I have read and agree to the Terms
                                    </label>
                                    <div className="text-danger">
                                        {formik.errors.acceptTerms ? formik.errors.acceptTerms : null}
                                    </div>
                                </div>
                                                    <div className="row">
                                                        <div className="col-sm-12">

                                                            <button type="submit" className="btn btn-primary btn-block"  disabled={loading} id="bahabtn3">
                                                                {loading && (
                                                                    <span className="spinner-border spinner-border-sm"></span>
                                                                )}
                                                                <span>Save Changes</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>




                    </div>
                </div>

                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;

