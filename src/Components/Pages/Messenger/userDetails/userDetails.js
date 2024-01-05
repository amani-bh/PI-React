import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  Paper,
  makeStyles,
} from "@material-ui/core";
import "./userDetails.css";
import axios from "axios";
import { AiFillHome, AiFillPhone } from "react-icons/ai";
import { PhoneDisabled, Phone } from "@material-ui/icons";
import { format } from "timeago.js";

import { SocketContext } from "../../../../Utils/socketContext";
import Peer from "simple-peer";

export default function UserDetails({
  friendId,
  currentUserId,
  usersConnected,
}) {
  const [friendUser, setFriendUser] = useState(null);
  const [checkFollow, setCheckFollow] = useState(null);
  const [followersCount, setFollowersCount] = useState(null);
  const [checkFriendOnline, setCheckFriendOnline] = useState(null);
  const [videoChatClicked, setVideoChatClicked] = useState(false);
  const [currentSocketId, setCurrentSocketId] = useState(null);
  const [friendSocketId, setFriendSocketId] = useState(null);
  const [currentUserSocketId, setCurrentUserSocketId] = useState(null);

  // styles video call
  const useStyles = makeStyles((theme) => ({
    video: {
      width: "550px",
      [theme.breakpoints.down("xs")]: {
        width: "300px",
      },
    },
    gridContainer: {
      justifyContent: "center",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    root: {
      display: "flex",
      flexDirection: "column",
    },
    gridContainer: {
      width: "100%",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
    },
    container: {
      width: "600px",
      margin: "35px 0",
      padding: 0,
      [theme.breakpoints.down("xs")]: {
        width: "80%",
      },
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: "10px",
      border: "2px solid black",
      margin: "10px",
    },
  }));

  const base_url = `${process.env.REACT_APP_URI_IO}/`;
  useEffect(() => {
    console.log(friendId);
    const getUserFriend = async () => {
      try {
        const res = await axios.get(
          base_url + "chat/findUserById?id=" + friendId
        );
        setFriendUser(res.data);
      } catch (err) {
        console.log(err.Message);
      }
    };

    getUserFriend();
    setVideoChatClicked(false);
  }, [friendId,followersCount]);

  useEffect(() => {
    usersConnected?.forEach(function (user) {
      if (user.userId == friendId) {
        setFriendSocketId(user.socketId);
      } else if (user.userId == currentUserId) setCurrentUserSocketId(user.socketId);
    });
  }, [usersConnected, friendId]);
  //check users follow
  useEffect(() => {
    setFollowersCount(friendUser?.followers?.length);

    const getCheckFollow = async () => {
      try {
        const res = await axios.get(
          base_url + "follow/checkFollow/" + currentUserId + "/" + friendId
        );
        setCheckFollow(res.data);
      } catch (err) {
        console.log(err.Message);
      }
    };
    getCheckFollow();
  }, [currentUserId, friendId, friendUser]);

  //follow user
  async function followUser() {
    const follow = {
      currentUser: currentUserId,
      friendUser: friendId,
    };
    console.log(friendUser);

    try {
      const res = await axios.put(base_url + "follow/follow/", follow);
      if (res.data.message == "success") {
        setCheckFollow(true);
        setFollowersCount(res.data.followersCount);
      }
    } catch (err) {
      console.log(err.Message);
    }
  }

  async function videoChat() {
    setVideoChatClicked(true);
  }

  async function unfollowUser() {
    const follow = {
      currentUser: currentUserId,
      friendUser: friendId,
    };

    try {
      const res = await axios.put(base_url + "follow/unfollow/", follow);
      console.log(res);
      if (res.data.message == "success") {
        setCheckFollow(false);
        setFollowersCount(res.data.followersCount);
      }
    } catch (err) {
      console.log(err.Message);
    }
  }
  useEffect(() => {
    usersConnected?.forEach(function (user) {
      if (user.userId == friendId) {
        //setFriendSocketId(user.socketId);

        setCheckFriendOnline(true);
      } else {
        setCheckFriendOnline(false);
      }
      if (user.userId == currentUserId) {
        setCurrentSocketId(user.socketId);
        console.log(currentSocketId);
      }
    });
  }, [usersConnected, friendId]);

  // videoCall

  const [idToCall, setIdToCall] = useState("");
  const { socket } = useContext(SocketContext);

  const [stream, setStream] = useState();
  const [call, setCall] = useState({});

  const userVideo = useRef();
  const [callAccepted, setCallAccepted] = useState(false);

  const [callEnded, setCallEnded] = useState(false);
  const connectionRef = useRef();

  const myVideo = useRef();
  const classes = useStyles();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    setIdToCall(friendSocketId);

    socket.on("me", (id) => console.log(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  useEffect(() => {
    socket.on("callEnded", (data) => {
      console.log(data.userToCall);
      window.location.reload();
    });
  }, [callEnded]);

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: friendSocketId });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = () => {
    console.log(currentUserSocketId);
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: friendSocketId,
        signalData: data,
        from: currentUserSocketId,
      });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    console.log("leave Call");
    setCallEnded(true);

    socket.emit("hangUpCall", {
      userToCall: friendSocketId,
      from: currentUserSocketId,
    });

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <div className="row" id="user-profile">
      <div className="col-lg-12 col-md-12 col-sm-12">
        <div className="main-box clearfix">
          <div className="positionCenterUser">
            <h1>
              {friendUser?.lastname?.toUpperCase() +
                " " +
                friendUser?.firstname?.charAt(0)?.toUpperCase() +
                friendUser?.firstname?.slice(1)}
            </h1>

            <div>
              {checkFriendOnline ? (
                <>
                  <b style={{ color: "green" }}>Online</b>
                </>
              ) : (
                <b>Offline</b>
              )}
            </div>

            {/* <div className="profile-status">
            <i className="fa fa-check-circle"></i>
          </div> */}
            <div className="positionCenterUser">
              <img
                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                alt=""
                className="profile-img img-responsive  "
              />

            </div>

            <div className="profile-stars">
              <span>{friendUser?.badge}</span>
            </div>

            {checkFollow ? (
              <>
                <div onClick={unfollowUser}>
                  <button className="btn">
                    <svg className="svgUserDetails">
                      <polyline />
                      <polyline />
                    </svg>
                    <span>Unfollow</span>
                  </button>
                </div>
              </>
            ) : (
              <div onClick={followUser}>
                <button className="btn">
                  <svg className="svgUserDetails">
                    <polyline />
                    <polyline />
                  </svg>
                  <span>Follow</span>
                </button>{" "}
              </div>
            )}
          </div>
        </div>
      </div>

      <Grid container className={classes.gridContainer}>
        {callAccepted && !callEnded && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>
                {call.name || "Name"}
              </Typography>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                className={classes.video}
              />
            </Grid>
          </Paper>
        )}
      </Grid>

      {callAccepted && !callEnded ? (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PhoneDisabled fontSize="large" />}
          fullWidth
          onClick={leaveCall}
          className={classes.margin}
        >
          Hang Up
        </Button>
      ) : (
        <div>
          <div className="follow">
            <div className="following">
              <b>Followers</b> <br />
              {friendUser?.followers?.length ? (
                <>
                  <span> {followersCount}</span>
                </>
              ) : (
                <span> 0</span>
              )}{" "}
            </div>
            <div className="following">
              <b>Following</b> <br />
              {friendUser?.following?.length ? (
                <>
                  <span> {friendUser?.following?.length}</span>
                </>
              ) : (
                <span> 0</span>
              )}
            </div>
          </div>

          <div className="profile-since">
            <b>Member since: </b> {friendUser?.createdAt?.substring(0, 4)}
          </div>
          <div className="profile-locationNumber">
            <AiFillPhone /> +216 {friendUser?.phone_number}
            <br />
            <AiFillHome />{" "}
            {friendUser?.address?.charAt(0)?.toUpperCase() +
              friendUser?.address?.slice(1)}
          </div>

          <div className="profile-details">
            <ul className="fa-ul">
              <li>
                <i className="fa-li fa fa-truck"></i>
                <b>Products active:</b>
                <span> {friendUser?.activeProducts_count}</span>
              </li>
              <li>
                <i className="fa-li fa fa-comment"></i>
                <b>Products sold:</b>
                <span> {friendUser?.productsSold_count}</span>
              </li>
              <li>
                <i className="fa-li fa fa-tasks"></i>
                <b>Last activity:</b>
                {friendUser?.lastActivity ? (
                  <>
                    <span> {format(friendUser?.lastActivity)}</span>
                  </>
                ) : (
                  <span>Not yet</span>
                )}
              </li>
            </ul>
          </div>
          <div className="positionDiv" onClick={callUser}>
            <button className="btn">
              <svg className="svgUserDetails">
                <polyline
                  points="179,1 179,59 1,59 1,1 179,1"
                  className="bg-line"
                />
                <polyline />
              </svg>
              <span>Video Chat</span>
            </button>
          </div>
        </div>
      )}

      {call?.isReceivingCall && !callAccepted && (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <h1>
            {friendUser?.lastname?.toUpperCase() +
              " " +
              friendUser?.firstname?.charAt(0)?.toUpperCase() +
              friendUser?.firstname?.slice(1)}{" "}
            is calling:
          </h1>

          <div onClick={answerCall}>
            <button className="btn">
              <svg
                width="180px"
                height="60px"
                viewBox="0 0 180 60"
                className="border svgUserDetails"
              >
                <polyline
                  points="179,1 179,59 1,59 1,1 179,1"
                  className="bg-line"
                />
                <polyline
                  points="179,1 179,59 1,59 1,1 179,1"
                  className="hl-line"
                />
              </svg>
              <span>Answer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
