import React, { useContext, useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link, useParams } from 'react-router-dom';
import { Bidding, EndEvent, getAuctionById } from '../../Utils/Auction';
import { SocketContext } from '../../Utils/socketContext';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Online from './online/Online';
import AuthService from './AuthServices/auth.service';

import * as fp from "fingerpose";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import { drawHand } from '../../Utils/DetectHand';

export default function AuctionDetails() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const { socket } = useContext(SocketContext);
    const id_user = AuthService.getCurrentUser().id;
    let { id } = useParams();
    const [details, setDetails] = useState();
    const [lastone, setLastone] = useState();
    const [usersConnected, setUsersConnected] = useState([]);
    const [statusbutton, setStatusbutton] = useState(true);
    const [modal, setModal] = useState(false);
    const { width, height } = useWindowSize();
    const [timer, setTimer] = React.useState(0);
    const [bid, setBid] = useState({
        idUser: id_user,
        value: 0
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAuctionById(id);
                setDetails(data)
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        socket.emit("addUser", id_user);
        socket.on("getUsers", (users) => {
            setUsersConnected(users);
        });
    }, [id_user]);
    useEffect(() => {
        socket.on("getUser", (users) => {
            setUsersConnected(users);
        });
    }, []);

    useEffect(() => {
        socket.on("getBid", (data) => {
            setLastone({
                bid: data.bid,
                user: data.user,
                all: data.all
            });
        });
    }, []);


    useEffect(() => {
        AOS.init({ duration: 2000 })

    });


    const addBid = async (idEvent, value) => {
        bid.value = value;
        const result = await Bidding(idEvent, bid);
        console.log(result.result);
        socket.emit("sendBid", {
            bid: result.bid,
            user: result.user,
        });
        socket.emit("sendWallet");
        socket.emit('reset');
    };

    var intervalID = setInterval(() => {
        socket.on('timer', function (data) {
            setTimer(data.countdown)
            if (data.countdown == 0) {
                setStatusbutton(false);
                clearInterval(intervalID)
            }
        });

    }, 1000);

    useEffect(() => {
        if (statusbutton === false) {
            setModal(true);
            const endEvent = async () => {
                try {
                    await EndEvent(details.event._id);
                } catch (error) {
                    console.log(error);
                }
            }
            endEvent();
        }
    }, [statusbutton, modal]);


    const runHandpose = async () => {
        const net = await handpose.load();
        //  Loop and detect hands
        setInterval(() => {
            detect(net);
        }, 1000);
    };

    const detect = async (net) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // Make Detections
            const hand = await net.estimateHands(video);
            if (hand.length > 0) {
                const GE = new fp.GestureEstimator([
                    fp.Gestures.ThumbsUpGesture,
                ]);
                const gesture = await GE.estimate(hand[0].landmarks, 8);

                if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
                    //setEmoji(gesture.gestures[0].name);
                    console.log(gesture.gestures[0].name);
                    addBid(id,1);
                    
                }
            }

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            drawHand(hand, ctx);

        }
    };
    useEffect(() => { runHandpose() }, []);



    return (
        <div className="section">
            {statusbutton === false && <Confetti width={width} height={height * 2} />}

            <div className="container">
                <div className='row mb-5'>
                <div className="col-md-10 col-md-push-2">
                        <div id="product-imgs">
                            <div className="product-preview auction-img col-md-3" >
                                <img src={details?.event.product.picture[0]} alt=""/>
                            </div>

                            <div className="product-preview auction-img col-md-3">
                                <img src={details?.event.product.picture[1]} alt="" />
                            </div>

                            <div className="product-preview auction-img col-md-3">
                                <img src={details?.event.product.picture[2]} alt="" />
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col-md-4 ">
                        <div id="">
                            <div className="">
                            <Webcam
                                        ref={webcamRef}
                                        style={{
                                            position: "absolute",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            left: 0,
                                            right: 0,
                                            textAlign: "center",
                                            zindex: 9,
                                            width: 400,
                                            height: 480,
                                        }}
                                    />

                                    <canvas
                                        ref={canvasRef}
                                        style={{
                                            position: "absolute",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                            left: 0,
                                            right: 0,
                                            textAlign: "center",
                                            zindex: 9,
                                            width: 400,
                                            height: 480,
                                        }}
                                    />
                            </div>

                        </div>
                    </div>
                    <div className='col-md-1'></div>
                  <div className="col-md-4">
                        <div className="product-details">
                            <h2 className="product-name">{details?.event.product.name} </h2>
                            <div>
                                <div className="product-rating">
                                   
                                </div>
                            </div>
                            <div>
                                <h3 className="product-price">${details?.event.startPrice}.00 <del className="product-old-price">${details?.event.product.price}.00</del></h3>
                            </div>
                            <p>
                                {lastone === undefined ? (
                                    details?.LastUser.firstname + " " + details?.LastUser.lastname
                                ) : (
                                    lastone.user.firstname + " " + lastone.user.lastname

                                )}

                            </p>

                            <div className='time-circle'>
                                <div className="time">
                                    {timer}
                                </div>
                            </div>
                            <div>
                                <h3 className="product-price">${lastone === undefined ? (
                                    details?.event.finalPrice

                                ) : (
                                    lastone.bid.value

                                )}</h3>
                            </div>
                            {statusbutton === true ? (
                                <div className="add-to-cart">
                                    <button className="add-to-cart-btn" onClick={() => addBid(details?.event._id, 1)} ><i className="fa fa-add"></i> 1.00</button>
                                    <button className="add-to-cart-btn" onClick={() => addBid(details?.event._id, 2)}><i className="fa fa-add"></i> 2.00</button>
                                    
                                </div>) : (
                                <div></div>
                            )}

                           
                        </div>
                    </div>
                    <div className='col-md-1'></div>
                    <div className="col-md-2">
                        <h4 className="rightbarTitle">Online Friends</h4>
                        <ul className="rightbarFriendList">
                            {usersConnected.map((u) => (
                                <Online key={u.socketId} user={u.userId} />
                            ))}
                        </ul>
                    </div>
                    {modal === true ? (
                        <div className="modall">
                            <div className="overllay"></div>

                            <div className="modall-content">
                                <div className="row">

                                    <h2>Winner</h2>
                                    <h1 className="modal-name" >
                                        {lastone === undefined ? (
                                            details?.LastUser.firstname + " " + details?.LastUser.lastname
                                        ) : (
                                            lastone.user.firstname + " " + lastone.user.lastname

                                        )}
                                    </h1>
                                    <h3 className="modal-price">Final Price : ${lastone === undefined ? (
                                        details?.event.finalPrice

                                    ) : (
                                        lastone.bid.value

                                    )}</h3>

                                    <Link to="/auction" className="modal-btn"> Return</Link>

                                </div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>




            </div>
        </div>
    )

}
