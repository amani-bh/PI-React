import React, { useContext, useEffect, useRef, useState } from "react";
import { queryServerApi } from "../../../Utils/queryServerApi";
import "./header.css";
import img from "../../OrderForm/UtilOrder/logo.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SocketContext } from "../../../Utils/socketContext";
import EventBus from "../../../Components/Pages/AuthCommons/EventBus";
import AuthService from "../../../Components/Pages/AuthServices/auth.service";

export default function () {
    const logOut = () => {

    EventBus.dispatch("logout");

  };
  const id = AuthService.getCurrentUser().id ;
  
  const [page, setPage] = useState(false);
  const [not, setNot] = useState(false);
  const [data, setData] = useState([]);
  const { socket } = useContext(SocketContext);

  const [noti, setNoti] = useState(false);
  const [socketData, setSD] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [bellNumber, setBellNumber] = useState(0);
  
  //const id = localStorage.getItem('id');
  
  const [reader, setReader] = useState(false);
  const [user, setUser] = useState({});
  const [settings, setSettings] = useState(false);

  const rec = async () => {
    const speech = new SpeechSynthesisUtterance();

    speech.text = "you have  new  notification";
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    socket.on("getNotifDelivery", (ws) => {
      setIsOpen(true);
      rec();
      setSD((s) => [ ws.content,...s]);
      setBellNumber((data) => data + 1);
    });
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  }, []);

  const deleteNotif = async (notif) => {
    await queryServerApi(
      "notif/delivery/deleteNotif/" + notif._id,
      null,
      "DELETE",
      false
    );
    setNoti(!noti);
  };
  const handleNavigation = (e) => {
    const window = e.currentTarget;
    if (window.scrollY > 100) {
      setPage(true);
    } else if (window.scrollY == 0) {
      setPage(false);
    }
    // setPage(window.scrollY);
  };
  useEffect(async () => {
    window.addEventListener("scroll", (e) => handleNavigation(e));
    const [res, err] = await queryServerApi("notif/delivery/getNotif/" + id);
    const [us, errs] = await queryServerApi("user/findone/" + id);
    setUser(us);
    setData(res.reverse());

    setBellNumber((s) => res.filter((data) => data.lu == false).length);
    return () => {
      // return a cleanup function to unregister our function since its gonna run multiple times
      window.removeEventListener("scroll", (e) => handleNavigation(e));
    };
  }, [noti, isOpen,socketData]);
  const markasRead = async (d) => {
    await queryServerApi(
      "notif/delivery/modifNotif/" + d._id,
      null,
      "PUT",
      false
    );
    setNoti(!noti);
  };
  return (
    <div className="body container">
      <div className="responsive-bar">
        <div className="logo">
          <img src={img} alt="logo" />
        </div>
        <div className="menu">
          <h4>Menu</h4>
        </div>
      </div>
      <nav className={page ? "black":undefined}>
        <div className="logo">
          <img src={img} alt="logo" />
        </div>
        <ul style={{ display: "flex", justifyContent: "flex-end" }}>
          <li>
            <Link to="/delivery/home">
              {" "}
              <span>Map </span>{" "}
            </Link>
          </li>
          <li>
            <Link to="/delivery/tasks">
              <span>Tasks </span>
            </Link>
          </li>
          <li>
            <Link to="/delivery/wheel">
              <span>Weekly game </span>
            </Link>
          </li>
          <li>
            <a>
              <i
                className="fas fa-coins  
              "
                style={{ color: "#E50D24" }}
              >
                {user.solde}
              </i>
            </a>
          </li>

          <li>
            <a
              onClick={() => {
                setNot(!not);
                setSettings(false);
                setNoti(false);
                // document.body.scrollTop = document.documentElement.scrollTop = 0;
              }}
            >
              <span className="fa-stack " data-count={bellNumber}>
                <motion.i
                  animate={
                    isOpen
                      ? {
                          scale: [1, 2, 2, 1, 1],
                          rotate: [300, 270, 270, 270, 0],
                          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                        }
                      : "closed"
                  }
                  className="fa fa-circle fa-stack-2x"
                  style={{ color: "#6E26FF" }}
                >
                  {" "}
                </motion.i>
                <i className="fa fa-bell fa-stack-1x fa-inverse"></i>
              </span>
            </a>

            {not && (
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="bodysHeader up-arrow"
              >
                <div className="card">
                  <span className="card__icon mdi mdi-alarm-light mdi-24px"></span>
                  <h2 className="card__title">Notifications</h2>
                  <center>
                    <div className="input-group">
                      <span className="input-group-btn">
                        <a
                          style={{ color: "purple", fontWeight: "400" }}
                          className={!reader ? "btn-outline-danger btn":undefined}
                          onClick={() => setReader(false)}
                        >
                          All
                        </a>{" "}
                        <a
                          style={{ color: "purple", fontWeight: "400" }}
                          className={reader ? "btn-outline-danger btn":undefined}
                          onClick={() => setReader(true)}
                        >
                          Unread
                        </a>
                      </span>
                    </div>
                  </center>

                  <ul className="card__list">
                    {socketData.map((d, i) => {
                      return (
                        <>
                          <div
                            className="notification-item "
                            key={i * 1000 + 1}
                          >
                            <li className="card__list-item">
                              {d.message
                                .toString()
                                .includes("you just take order") && (
                                <img
                                  src="data:image/png;base64,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"
                                  alt=""
                                />
                              )}

                              {d.message
                                .toString()
                                .includes("you just take order") ||
                                (d.message
                                  .toString()
                                  .includes("you just sign that") && (
                                  <img
                                    src={
                                      d.message
                                        .toString()
                                        .includes("you just take order")
                                        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzZvs68lZEFqSP2eCC4CX2okYz8A3hCN-WxQ&usqp=CAU"
                                        : "https://pas-wordpress-media.s3.amazonaws.com/content/uploads/2017/03/10155101/Bplans-Headers-2021-2.jpg"
                                    }
                                    alt=""
                                  />
                                ))}

                              {d.message
                                .toString()
                                .includes("you just finish another task") && (
                                <img
                                  src="https://play-lh.googleusercontent.com/1lPRqf2xxpuaP3Qp_hmiy_dTumN5V3P2UCYfnJy6LoA3omuQtuixMm5rLeat8CZRB2A"
                                  alt=""
                                />
                              )}

                              {d.message
                                .toString()
                                .includes("you just won") && (
                                <img
                                  src="https://qph.fs.quoracdn.net/main-qimg-edd83bee96853a3dd1b9d91aaa924def.webp"
                                  alt=""
                                />
                              )}

                              <div
                                className="card__list-item__info"
                                style={{ backgroundColor: "rgba(0,10,10,0.1)" }}
                              >
                                <h2>Admin</h2>
                                <span
                                  className="mdi mdi-heart"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {" "}
                                  Message : {d.message}
                                </span>
                                <span className="mdi mdi-heart">
                                  {" "}
                                  {d.date.toString().substring(0, 10)}{" "}
                                </span>
                              </div>
                            </li>
                          </div>
                          <hr />
                        </>
                      );
                    })}
                    {data.map((d, i) => {
                      if (
                        (d.lu == false && reader == true) ||
                        reader == false
                      ) {
                        return (
                          <div className="notification-item" key={d._id}>
                            <li className="card__list-item">
                              <a
                                style={{ position: "absolute" }}
                                onClick={() => deleteNotif(d)}
                              >
                                <i
                                  style={{
                                    position: "relative",
                                    right: "2rem",
                                  }}
                                  className="fa-solid fa-xmark"
                                ></i>
                              </a>
                              {d.message
                                .toString()
                                .includes("you just finish another task") && (
                                <img
                                  src="https://play-lh.googleusercontent.com/1lPRqf2xxpuaP3Qp_hmiy_dTumN5V3P2UCYfnJy6LoA3omuQtuixMm5rLeat8CZRB2A"
                                  alt=""
                                />
                              )}
                              {d.message
                                .toString()
                                .includes("you just take order") && (
                                <img
                                  src="data:image/png;base64,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"
                                  alt=""
                                />
                              )}
                              {d.message
                                .toString()
                                .includes("you just sign that") && (
                                <img
                                  src="https://pas-wordpress-media.s3.amazonaws.com/content/uploads/2017/03/10155101/Bplans-Headers-2021-2.jpg"
                                  alt=""
                                />
                              )}

                              {d.message
                                .toString()
                                .includes("you just won") && (
                                <img
                                  src="https://qph.fs.quoracdn.net/main-qimg-edd83bee96853a3dd1b9d91aaa924def.webp"
                                  alt=""
                                />
                              )}
                              <div
                                className="card__list-item__info"
                                style={{
                                  background:
                                    d.lu == false
                                      ? "rgba(0,10,10,0.1)"
                                      : "none",
                                }}
                              >
                                <h2>Admin</h2>
                                <span
                                  className="mdi mdi-heart"
                                  style={{ whiteSpace: "pre-wrap" }}
                                >
                                  {" "}
                                  Message : {d.message}
                                </span>
                                <span className="mdi mdi-heart">
                                  {" "}
                                  {d.date.toString().substring(0, 10)}{" "}
                                  {d.lu == false && (
                                    <a
                                      onClick={() => markasRead(d)}
                                      style={{
                                        position: "absolute",
                                        right: "3%",
                                        cursor: "pointer",
                                        color: "black",
                                      }}
                                    >
                                      Mark as read
                                    </a>
                                  )}
                                </span>
                              </div>
                            </li>
                            <hr />
                          </div>
                        );
                      }
                    })}
                  </ul>
                </div>
              </motion.div>
            )}
          </li>
          <li>
            <div
              className="User-area"
              style={{ marginRight: "100px", marginLeft: "10px" }}
            >
              <div className="User-avtar">
                <a
                  onClick={() => {
                    setSettings(!settings);
                    setNot(false);
                  }}
                >
                  {" "}
                  <img
                    style={{ borderRadius: "100%" }}
                    src={user.picture }
                  />
                </a>
              </div>
              {settings && (
                <motion.ul
                  className="User-Dropdown U-open"
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5 }}
                >
                  <li>
                    <a href="#">My Profile</a>
                  </li>
                  <li>
                    <a href="#">Settings</a>
                  </li>
                  <li>
                    <a href="" onClick={logOut}>Logout</a>
                  </li>
                </motion.ul>
              )}
            </div>
          </li>
        </ul>
      </nav>

      {not && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="bodyResponsive up-arrow"
        >
          <div className="card">
            <span className="card__icon mdi mdi-alarm-light mdi-24px"></span>
            <h2 className="card__title">Notifications</h2>
            <center>
              <div className="input-group">
                <span className="input-group-btn">
                  <a
                    style={{ color: "purple", fontWeight: "400" }}
                    className={!reader ? "btn-outline-danger btn":undefined }
                    onClick={() => setReader(false)}
                  >
                    All
                  </a>{" "}
                  <a
                    style={{ color: "purple", fontWeight: "400" }}
                    className={reader ? "btn-outline-danger btn":undefined}
                    onClick={() => setReader(true)}
                  >
                    Unread
                  </a>
                </span>
              </div>
            </center>

            <ul className="card__list">
              {socketData.map((d, i) => {
                return (
                  <>
                    <div className="notification-item " key={i * 1000 + 1}>
                      <li className="card__list-item">
                        {d.message.toString().includes("you just take order") ||
                          (d.message
                            .toString()
                            .includes("you just sign that") && (
                            <img
                              src={
                                d.message
                                  .toString()
                                  .includes("you just take order")
                                  ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzZvs68lZEFqSP2eCC4CX2okYz8A3hCN-WxQ&usqp=CAU"
                                  : "https://pas-wordpress-media.s3.amazonaws.com/content/uploads/2017/03/10155101/Bplans-Headers-2021-2.jpg"
                              }
                              alt=""
                            />
                          ))}

                        {d.message.toString().includes("you just won") && (
                          <img
                            src="https://qph.fs.quoracdn.net/main-qimg-edd83bee96853a3dd1b9d91aaa924def.webp"
                            alt=""
                          />
                        )}

                        <div
                          className="card__list-item__info"
                          style={{ backgroundColor: "rgba(0,10,10,0.1)" }}
                        >
                          <h2>Admin</h2>
                          <span
                            className="mdi mdi-heart"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {" "}
                            Message : {d.message}
                          </span>
                          <span className="mdi mdi-heart">
                            {" "}
                            {d.date.toString().substring(0, 10)}{" "}
                          </span>
                        </div>
                      </li>
                    </div>
                    <hr />
                  </>
                );
              })}
              {data.map((d, i) => {
                if ((d.lu == false && reader == true) || reader == false) {
                  return (
                    <div className="notification-item" key={d._id}>
                      <li className="card__list-item">
                        <a
                          style={{ position: "absolute" }}
                          onClick={() => deleteNotif(d)}
                        >
                          <i
                            style={{ position: "relative", right: "2rem" }}
                            className="fa-solid fa-xmark"
                          ></i>
                        </a>
                        {d.message
                          .toString()
                          .includes("you just take order") && (
                          <img
                            src="data:image/png;base64,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"
                            alt=""
                          />
                        )}
                        {d.message
                          .toString()
                          .includes("you just sign that") && (
                          <img
                            src="https://pas-wordpress-media.s3.amazonaws.com/content/uploads/2017/03/10155101/Bplans-Headers-2021-2.jpg"
                            alt=""
                          />
                        )}

                        {d.message.toString().includes("you just won") && (
                          <img
                            src="https://qph.fs.quoracdn.net/main-qimg-edd83bee96853a3dd1b9d91aaa924def.webp"
                            alt=""
                          />
                        )}
                        <div
                          className="card__list-item__info"
                          style={{
                            background:
                              d.lu == false ? "rgba(0,10,10,0.1)" : "none",
                          }}
                        >
                          <h2>Admin</h2>
                          <span
                            className="mdi mdi-heart"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {" "}
                            Message : {d.message}
                          </span>
                          <span className="mdi mdi-heart">
                            {" "}
                            {d.date.toString().substring(0, 10)}{" "}
                            {d.lu == false && (
                              <a
                                onClick={() => markasRead(d)}
                                style={{
                                  position: "absolute",
                                  right: "3%",
                                  cursor: "pointer",
                                  color: "black",
                                }}
                              >
                                Mark as read
                              </a>
                            )}
                          </span>
                        </div>
                      </li>
                      <hr />
                    </div>
                  );
                }
              })}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}