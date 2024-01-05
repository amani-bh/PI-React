import { motion } from "framer-motion";
import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../static/header";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Footer from "../static/footer";
import "./styles.css";

import WheelComponent from "react-wheel-of-prizes";
import { queryServerApi } from "../../../Utils/queryServerApi";
import { SocketContext } from "../../../Utils/socketContext";
import AuthService from "../../../Components/Pages/AuthServices/auth.service";

const Wheeler = () => {
  const id = AuthService.getCurrentUser().id ;

  const { width, height } = useWindowSize();

  const { socket } = useContext(SocketContext);
  const [user, setUser] = useState({});
  const [cong, setCong] = useState(false);
  useEffect(async () => {
    const [us, errs] = await queryServerApi("user/findone/" + id);
    setUser(us);
  }, [width]);

  const [win, setWinnings] = useState("");
  const segments = [
    "better luck next week",
    "won 7 coins",
    "won 10  coins ",
    "better luck next week",
    "won 2 coins ",
    "won  5 coins ",
    "better luck next week",
    "won 15 coins ",
  ];
  const segColors = [
    "#6F24FF",
    "red",
    "#6F24FF",
    "red",
    "#6F24FF",

    "red",
    "#6F24FF",
    "red",
  ];

  const onFinished = async (winner) => {
    setWinnings(winner + ",comeback next week !!");
    if (winner != "better luck next week") {
      setCong(true);
      await queryServerApi(
        "notif/delivery/postNotif",
        {
          message: "you just " + winner,
          ref: Math.floor(Math.random * 1200),
          id_LIV: id,
        },
        "POST",
        false
      );

      socket.emit("notificationDelivery", id, {
        ref: Math.floor(Math.random * 1200),
        message: "you just " + winner,
        date: new Date(),
      });

      await queryServerApi(
        "user/updateForDeliveryMan/" + id,
        { solde: winner },
        "PUT"
      );
    }
  };
  return (
    <div style={{ overflowX: "hidden", backgroundColor: "rgba(0,10,10,0.05)" }}>
      {cong && <Confetti width={width} height={height} />}
      <br />
      <br />
      <br />
      <motion.div
        className="resp"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3 }}
      >
        {" "}
        {Number(
          new Date().toString().substring(8, 11) -
            (7 + Number(user?.dateHazard?.substring(8, 10))) >=
            0
        ) ||
        new Date().getMonth() > new Date(user.dateHazard).getMonth() ||
        user.hazard == false ? (
          <WheelComponent
            segments={segments}
            segColors={segColors}
            winningSegment={win}
            onFinished={(winner) => onFinished(winner)}
            primaryColor="purple"
            contrastColor="white"
            buttonText="Spin"
            size={260}
          />
        ) : (
          <h1
            style={{
              marginTop: "200px",
              marginBottom: "300px",
              color: "#6E26FF",
            }}
          >
            You should comeback after{" "}
            {7 +
              Number(user?.dateHazard?.substring(8, 10)) -
              Number(new Date().toString().substring(8, 11))}{" "}
            days .{" "}
          </h1>
        )}
      </motion.div>
    </div>
  );
};

export default Wheeler;
