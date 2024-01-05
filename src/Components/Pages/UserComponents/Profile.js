import React, {useEffect, useState} from "react";
import AuthService from "../AuthServices/auth.service";
import "./ProfileStyle.css";
import UserService from "../AuthServices/user.service";
import {useNavigate} from "react-router-dom";
import EventBus from "../AuthCommons/EventBus";

const Profile = () => {
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
                    EventBus.dispatch("logout");
                }


            }
        );

    }, []);
    const navigate = useNavigate();
    const userUpdateInfo = () => {
//    AuthService.logout();
        navigate("/updateprofile", { state: { message: "Ok" } });

    };
    return(
        <div className="container">
            <div className="baha-main-body">



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
                                        <h6 className="mb-0">Full Name</h6>
                                    </div>
                                    <div className="col-sm-9 text-secondary">
                                        {userinfo.firstname} {userinfo.lastname}
                                    </div>
                                </div>
                                <hr></hr>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Email</h6>
                                        </div>
                                        <div className="col-sm-9 text-secondary">
                                            {userinfo.email}
                                        </div>
                                    </div>
                                    <hr></hr>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Phone</h6>
                                            </div>
                                            <div className="col-sm-9 text-secondary">
                                                {userinfo.phone_number}
                                            </div>
                                        </div>
                                        <hr></hr>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Badge</h6>
                                                </div>
                                                <div className="col-sm-9 text-secondary">
                                                    {userinfo.badge}
                                                </div>
                                            </div>
                                            <hr></hr>
                                                <div className="row">
                                                    <div className="col-sm-3">
                                                        <h6 className="mb-0">Address</h6>
                                                    </div>
                                                    <div className="col-sm-9 text-secondary">
                                                        {userinfo.address}
                                                    </div>
                                                </div>
                                                <hr></hr>
                                                    <div className="row">
                                                        <div className="col-sm-12">
                                                            <a className="btn btn-info" target="__blank" id="bahabtn2"
                                                                onClick={userUpdateInfo}>Edit</a>
                                                        </div>
                                                    </div>
                            </div>
                        </div>




                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

