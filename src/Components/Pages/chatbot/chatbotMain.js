import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "reactstrap";
import MapMarker from "../../../ComponentsDeliveryOffice/OrderForm/UtilOrder/MapMarker";
import { queryServerApi } from "../../../Utils/queryServerApi";
import { systemMine } from "../../../Utils/Blockchain";

import AuthService from "../AuthServices/auth.service";
import "./chatbotMain.css";
import { SocketContext } from "../../../Utils/socketContext";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function ChatbotMain(props) {
  const { socket } = useContext(SocketContext);

  const [dataBOT, setDataBOT] = useState([]);
  const [ld, setLD] = useState(false);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [mapper, setMapper] = useState("test");

  const [dataCL, setDataCL] = useState([]);
  const [waiter, setWaiter] = useState(false);
  const [msg, setMsg] = useState("");
  const [recorder, setRecoreder] = useState(false);
  const [tor, setTor] = useState([]);
  const [storyMsg, setSotryMSg] = useState("");
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  const scrollToBottom = () => {
    window.scrollTo(
      0,
      document
        .querySelector(".messages-content")
        .scrollTo(
          0,
          document.querySelector(".messages-content").scrollHeight + 1000
        )
    );
  };
  const rec = () => {
    setRecoreder(true);

    recognition.start();
    recognition.onresult = async (e) => {
      let resultIndex = e.resultIndex;
      const transcript = e.results[resultIndex][0].transcript;
      const speech = new SpeechSynthesisUtterance();

      getData(transcript);
    };
  };
  const id = AuthService.getCurrentUser().id;
  const [r, setR] = useState(false);
  useEffect(async () => {
    const [b] = await queryServerApi("user/findone/" + id);
    setR(b.trackBot);
    console.log(b);
  }, [ld]);

  const getData = async (e = null) => {
    setMsg("");
    scrollToBottom();
    var dash = true;
    setRecoreder(false);

    if (e) {
      setDataCL((s) => [...s, e]);
    } else setDataCL((s) => [...s, msg]);
    setWaiter(true);
    if (r && msg.toString().includes("age:")) {
      // setDataBOT((s) => [...s, "sorry you can only use this survey once"]);
      let c = await axios.get(`${process.env.REACT_APP_CHATBOT}/` + "nonono");
      setDataBOT((s) => [...s, c]);
    } else {
      if (e) {
        let c = await axios.get(`${process.env.REACT_APP_CHATBOT}/` + e);
        console.log(typeof c);

        setDataBOT((s) => [...s, c]);
      } else {
        const c = await axios.get(`${process.env.REACT_APP_CHATBOT}/` + msg);
        setDataBOT((s) => [...s, c]);
      }
    }

    setWaiter(false);

    if (msg.toString().includes("age:")) {
      payBot();
    }
  };

  const payBot = async () => {
    if (!r) {
      await queryServerApi("user/update/payementBOT/" + id, null, "PUT");
      setLD(!ld);
      await systemMine(AuthService.getCurrentUser().publicKey, 1);
      socket.emit("sendWallet");
    }
  };
  const [loc, setLoc] = useState();

  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLoc(
        storyMsg +
          "," +
          "location:" +
          [parseInt(pos.coords.latitude), parseInt(pos.coords.longitude)]
      );
    });
  };

  return (
    <div className="all">
      <div className="chat-bot body-chatbot">
        <div className="chat-title-bot">
          <h1>Nes mleh</h1>
          <h2>Weld bled w n3awen</h2>
          <figure className="avatar">
            <img src="https://cdn.dribbble.com/users/1953813/screenshots/5350927/chatbot-icon.jpg" />
          </figure>

          <div className="r-nav">
            <ul>
              <li>
                {" "}
                <a
                  onClick={() => {
                    props.closer(false);
                  }}
                >
                  X
                </a>
              </li>

              <li>
                {" "}
                <a>
                  <img
                    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjAuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iJiMxMDU3OyYjMTA4MzsmIzEwODY7JiMxMDgxO18xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDY0IDY0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA2NCA2NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzFfXzQ0MDQyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjMxLjk5OTMiIHkxPSI3LjI0OTMiIHgyPSIzMS45OTkzIiB5Mj0iNTcuMjczMiIgc3ByZWFkTWV0aG9kPSJyZWZsZWN0Ij4KCTxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzFBNkRGRiIvPgoJPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojQzgyMkZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxwYXRoIHN0eWxlPSJmaWxsOnVybCgjU1ZHSURfMV9fNDQwNDIpOyIgZD0iTTU3LjY0NSwzMS44NjRDNTcuMjg5LDMxLjMyMyw1Ni43MDYsMzEsNTYuMDg3LDMxaC0yLjExMUM1My40NDksMTgsNDIuODk4LDcuOTk5LDMwLDcuOTk5ICBDMTYuNzY2LDcuOTk5LDUuOTk5LDE4Ljc2Niw1Ljk5OSwzMlMxNi43NjYsNTYuMDAxLDMwLDU2LjAwMWM2LjI2NywwLDEyLjE5Ni0yLjQsMTYuNjk2LTYuNzU5bC0xLjM5MS0xLjQzOCAgQzQxLjE4LDUxLjgsMzUuNzQ0LDU0LjAwMSwzMCw1NC4wMDFDMTcuODY5LDU0LjAwMSw3Ljk5OSw0NC4xMzEsNy45OTksMzJTMTcuODY5LDkuOTk5LDMwLDkuOTk5QzQxLjc5Niw5Ljk5OSw1MS40NSwyMCw1MS45NzUsMzEgIGgtMi4wNjFjLTAuNjE5LDAtMS4yMDIsMC4zMjMtMS41NTksMC44NjRjLTAuMzk3LDAuNjA1LTAuNDY2LDEuMzk3LTAuMTc3LDIuMDY5bDIuMjY4LDUuMjgzYzAuNDcyLDEuMSwxLjQ1LDEuNzgzLDIuNTU0LDEuNzgzICBjMS4xMDQsMCwyLjA4Mi0wLjY4NCwyLjU1NC0xLjc4M2wyLjI2OC01LjI4M0M1OC4xMTEsMzMuMjYyLDU4LjA0MywzMi40NjksNTcuNjQ1LDMxLjg2NHogTTU1Ljk4NCwzMy4xNDVsLTIuMjY4LDUuMjgzICBjLTAuMzEzLDAuNzI3LTEuMTE5LDAuNzI3LTEuNDMyLDBsLTIuMjY4LTUuMjgzQzQ5Ljk5MywzMy4wODksNTAsMzMuMDM1LDUwLjAxLDMzaDUuOTgxQzU2LjAwMiwzMy4wMzUsNTYuMDA4LDMzLjA4OSw1NS45ODQsMzMuMTQ1ICB6Ii8+CjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMl9fNDQwNDIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMzAiIHkxPSI3LjI0OTMiIHgyPSIzMCIgeTI9IjU3LjI3MzIiIHNwcmVhZE1ldGhvZD0icmVmbGVjdCI+Cgk8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMxQTZERkYiLz4KCTxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0M4MjJGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzJfXzQ0MDQyKTsiIGQ9Ik0yOS44NjQsMjQuNjQ0YzAuMzU1LDAuMjM0LDAuNzc2LDAuMzU0LDEuMTk5LDAuMzU0YzAuMjk2LDAsMC41OTMtMC4wNTgsMC44NjktMC4xNzcgIGw1LjI4NC0yLjI2OEMzOC4zMTcsMjIuMDgyLDM5LDIxLjEwMywzOSwyMHMtMC42ODQtMi4wODItMS43ODMtMi41NTRsLTUuMjg0LTIuMjY4Yy0wLjY3MS0wLjI4OC0xLjQ2NC0wLjIyMS0yLjA2OCwwLjE3NyAgQzI5LjMyMywxNS43MTEsMjksMTYuMjkzLDI5LDE2LjkxM3YyLjEzOEMyMiwxOS41NjQsMTcsMjUuMTY5LDE3LDMyYzAsNy4xNjgsNS44MzIsMTMsMTMsMTNzMTMtNiwxMy0xM2gtMmMwLDYtNC45MzUsMTEtMTEsMTEgIHMtMTEtNC45MzUtMTEtMTFjMC01LjcyOCw0LTEwLjQ0MiwxMC0xMC45NXYyLjAzNkMyOSwyMy43MDYsMjkuMzIzLDI0LjI4OCwyOS44NjQsMjQuNjQ0eiBNMzEsMTcuMDA5ICBjMC0wLjAxMiwwLjA4Ny0wLjAxNywwLjE0NCwwLjAwN2w1LjI4NCwyLjI2OEMzNi43OTEsMTkuNDQsMzcsMTkuNzAxLDM3LDIwYzAsMC4yOTktMC4yMDksMC41Ni0wLjU3MiwwLjcxNmwtNS4yODQsMi4yNjggIEMzMS4wODcsMjMuMDA3LDMxLDIzLjAwMiwzMSwyMi45OVYxNy4wMDl6Ii8+CjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfM19fNDQwNDIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjkuOTk5OSIgeTE9IjI2Ljk5OTkiIHgyPSIyOS45OTk5IiB5Mj0iMzcuNzYxOCIgc3ByZWFkTWV0aG9kPSJyZWZsZWN0Ij4KCTxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzZEQzdGRiIvPgoJPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRTZBQkZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxjaXJjbGUgc3R5bGU9ImZpbGw6dXJsKCNTVkdJRF8zX180NDA0Mik7IiBjeD0iMzAiIGN5PSIzMiIgcj0iNCIvPgo8L3N2Zz4K"
                    width="26px"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="messages-bot">
          <div className="messages-content">
            <div className="message new">
              <figure className="avatar">
                <img src="https://cdn.dribbble.com/users/1953813/screenshots/5350927/chatbot-icon.jpg" />
              </figure>
              <p style={{ color: "#6e26ff" }}>
                {" "}
                Hello , my names is Nes mleh how can i help ?
              </p>
            </div>

            {dataCL.map((d, i) => {
              return (
                <div key={i}>
                  <div className="message message-personal"> {d}</div>

                  {dataBOT.map((k, j) => {
                    if (i == j) {
                      if (!k.data.pic)
                        return (
                          <div key={j * 100} className="message new">
                            <figure className="avatar">
                              <img src="https://cdn.dribbble.com/users/1953813/screenshots/5350927/chatbot-icon.jpg" />
                            </figure>{" "}
                            {k.data
                              .toString()
                              .includes(
                                "please type (price :product price,product:your choice)"
                              ) ? (
                              <div>
                                <>
                                  <span>
                                    please give us the price of the product :
                                  </span>
                                  <br />
                                  <div class="input-container-bot">
                                    <textarea
                                      disabled={tor.includes(j)}
                                      type="text"
                                      className="message-input"
                                      placeholder="type here ..."
                                      style={{
                                        color: " #6e26ff ",
                                        width: "95%",
                                      }}
                                      onChange={(event) => {
                                        setSotryMSg(
                                          "price:" + event.target.value
                                        );
                                      }}
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          setTor((d) => [...d, j]);
                                          setWaiter(true);
                                          setTimeout(() => {
                                            localStorage.setItem("nta", 1);
                                            setWaiter(false);
                                          }, 500);
                                          scrollToBottom();
                                        }
                                      }}
                                    />
                                  </div>
                                </>
                                <br />
                                {localStorage.getItem("nta") && (
                                  <>
                                    <span>
                                      please give us the name of the product :
                                    </span>
                                    <br />
                                    <div class="input-container-bot">
                                      <textarea
                                        disabled={tor.includes(j + 5000)}
                                        type="text"
                                        className="message-input"
                                        placeholder="type here ..."
                                        style={{
                                          color: " #6e26ff ",
                                          width: "95%",
                                        }}
                                        onChange={(event) => {
                                          setMsg(
                                            storyMsg +
                                              "," +
                                              "product:" +
                                              event.target.value
                                          );
                                        }}
                                        onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                            getData(null);
                                            setTor((d) => [...d, j + 5000]);
                                            localStorage.removeItem("nta");
                                            scrollToBottom();
                                          }
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div>
                                {k.data
                                  .toString()
                                  .includes(
                                    "please type (product='your choice') "
                                  ) ||
                                k.data
                                  .toString()
                                  .includes("description:what you need ") ? (
                                  <div className="body-bot-2">
                                    {k.data
                                      .toString()
                                      .includes(
                                        "please type (product='your choice') "
                                      ) ? (
                                      <div>
                                        <span>
                                          please give us the product name :
                                        </span>
                                        <br />
                                        <div class="input-container-bot">
                                          <textarea
                                            disabled={tor.includes(j)}
                                            type="text"
                                            className="message-input"
                                            placeholder="type here ..."
                                            style={{
                                              color: " #6e26ff ",
                                              width: "95%",
                                            }}
                                            onChange={(event) => {
                                              setMsg(
                                                "product=" + event.target.value
                                              );
                                            }}
                                            onKeyPress={(e) => {
                                              if (e.key === "Enter") {
                                                getData(null);
                                                setTor((d) => [...d, j]);
                                                scrollToBottom();
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <span>
                                          please give us a short description :
                                        </span>
                                        <br />
                                        <div class="input-container-bot">
                                          <textarea
                                            disabled={tor.includes(j)}
                                            type="text"
                                            className="message-input"
                                            placeholder="type here ..."
                                            style={{
                                              color: " #6e26ff ",
                                              width: "95%",
                                            }}
                                            onChange={(event) => {
                                              setMsg(
                                                "description:" +
                                                  event.target.value
                                              );
                                            }}
                                            onKeyPress={(e) => {
                                              if (e.key === "Enter") {
                                                getData(null);
                                                setTor((d) => [...d, j]);
                                                scrollToBottom();
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p> {k.data} </p>
                                )}
                              </div>
                            )}
                            {k.data
                              .toString()
                              .includes(
                                "please type in form below 'age:your age,category:your prefered categorie ' "
                              ) && (
                              <>
                                <span>please give your age :</span>
                                <br />
                                <div class="input-container-bot">
                                  <textarea
                                    disabled={tor.includes(j)}
                                    type="text"
                                    className="message-input"
                                    placeholder="type here ..."
                                    style={{
                                      color: " #6e26ff ",
                                      width: "95%",
                                    }}
                                    onChange={(event) => {
                                      setSotryMSg("age:" + event.target.value);
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        setTor((d) => [...d, j]);
                                        setWaiter(true);
                                        setTimeout(() => {
                                          localStorage.setItem("mda", 1);
                                          setWaiter(false);
                                        }, 500);
                                        scrollToBottom();
                                      }
                                    }}
                                  />
                                </div>
                              </>
                            )}
                            <br />
                            {localStorage.getItem("mda") && (
                              <>
                                <span>
                                  please give us the category you are interested
                                  in
                                </span>
                                <br />
                                <div class="input-container-bot">
                                  <select
                                    disabled={tor.includes(j + 5000)}
                                    type="text"
                                    className="message-input"
                                    placeholder="type here ..."
                                    style={{
                                      color: " #6e26ff ",
                                      width: "95%",
                                    }}
                                    onChange={(event) => {
                                      setSotryMSg(
                                        storyMsg +
                                          "," +
                                          "budget:" +
                                          event.target.value
                                      );
                                    }}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        getData(null);
                                        scrollToBottom();
                                      }
                                    }}
                                  >
                                    <option>Choose your budget ...</option>
                                    <option value="<0500"> {"<500"} </option>
                                    <option value="<1000">{"<1000"}</option>
                                    <option value=">1000">{">1000"}</option>
                                  </select>
                                  <select
                                    disabled={tor.includes(j + 5000)}
                                    type="text"
                                    className="message-input"
                                    placeholder="type here ..."
                                    style={{
                                      color: " #6e26ff ",
                                      width: "95%",
                                    }}
                                    onChange={currentLocation}
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        getData(null);
                                        scrollToBottom();
                                      }
                                    }}
                                  >
                                    <option>Choose your location ...</option>
                                    <option value="current">
                                      Get my current position{" "}
                                    </option>
                                    <option value="map">
                                      Get my position from the map
                                    </option>
                                  </select>

                                  <select
                                    disabled={tor.includes(j + 5000)}
                                    type="text"
                                    className="message-input"
                                    placeholder="type here ..."
                                    style={{
                                      color: " #6e26ff ",
                                      width: "95%",
                                    }}
                                    onChange={(event) => {
                                      setMsg(
                                        loc +
                                          "," +
                                          "category:" +
                                          event.target.value
                                      );
                                      localStorage.removeItem("mda");
                                    }}
                                  >
                                    <option>Choose an option ...</option>
                                    <option value="laptops">Laptops</option>
                                    <option value="accessories">
                                      Accessories
                                    </option>
                                    <option value="cameras">Cameras</option>
                                  </select>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      else
                        return (
                          <div
                            style={{ width: "70%" }}
                            key={j * 100}
                            className="message new"
                          >
                            <figure className="avatar">
                              <img src="https://cdn.dribbble.com/users/1953813/screenshots/5350927/chatbot-icon.jpg" />
                            </figure>
                            <img
                              style={{ width: "100%" }}
                              src={k.data.pic[0]}
                            />
                            <br />
                            <center>
                              <h3 style={{ color: "#fff" }}>{k.data.name}</h3>
                              <Link to={"/product/" + k.data.id}>
                                go to details
                              </Link>
                            </center>
                          </div>
                        );
                    }
                  })}
                </div>
              );
            })}
          </div>
          {waiter && (
            <div
              className="message loading new"
              style={{
                position: "absolute",
                bottom: "0%",
              }}
            >
              <figure className="avatar">
                <img src="https://cdn.dribbble.com/users/1953813/screenshots/5350927/chatbot-icon.jpg" />
              </figure>
            </div>
          )}
        </div>

        <div className="message-box">
          <textarea
            type="text"
            value={msg}
            className="message-input"
            placeholder="Type message..."
            onChange={(event) => {
              setMsg(event.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") getData(null);
            }}
          ></textarea>
          <div class="boxBot">
            <div class="objectBot">
              <div className={recorder ? "outlineBot" : "null"}></div>
              <div class="buttonBot">
                <a onClick={rec}>
                  <i
                    style={{
                      color: !recorder ? "#6e26ff" : "red",
                      marginLeft: "20px",
                    }}
                    className="fa-solid fa-2xl  fa-microphone"
                  ></i>
                </a>
              </div>
            </div>
          </div>{" "}
          <button
            onClick={() => getData(null)}
            type="submit"
            className="message-submit-bot sound-on-click"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
