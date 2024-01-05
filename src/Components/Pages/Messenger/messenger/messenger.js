import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  Suspense,
} from "react";
import Conversation from "../conversations/conversation";
import "./messenger.css";
import Message from "../messages/message";
import axios from "axios";
import UserDetails from "../userDetails/userDetails";
import { io } from "socket.io-client";
import { SocketContext } from "../../../../Utils/socketContext";
import { getProductById } from "../../../../Utils/Product";
import { seenConversation } from "../../../../Utils/Message";
import AuthService from "../../AuthServices/auth.service";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useReactMediaRecorder } from "react-media-recorder";
import fileDownload from "js-file-download";

export default function Messenger() {
  const base_url = `${process.env.REACT_APP_URI_IO}/`;

  //insert and get User from storage
  var idUser = AuthService.getCurrentUser().id;

  //get friend id

  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  // const socket = useRef();

  const scrollRef = useRef();
  const [usersConnected, setUsersConnected] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [product, setProduct] = useState();
  const [picture, setPicture] = useState();
  const [onChangeMessage, setOnChangeMessage] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [voice, setVoice] = useState(null);
  const [second, setSecond] = useState("00");
  const [minute, setMinute] = useState("00");
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(0);
  const {
    status,
    startRecording,
    stopRecording,
    pauseRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({
    video: false,
    audio: true,
    echoCancellation: true,
  });

  //const { testMessage } = useContext(SocketContext);
  const { socket } = useContext(SocketContext);

  var friendId = null;
  if (idUser == currentChat?.first) friendId = currentChat?.second;
  else if (idUser == currentChat?.second) friendId = currentChat?.first;

  useEffect(() => {
    // socket.current = io("ws://localhost:8900");
  }, []);
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    socket.on("getMessage", (data) => {
      if (data?.audio?.base64 != null) {
        setArrivalMessage({
          sender: data.sender,
          receiver: data.receiver,
          content: data.content,
          sendedAt: data.sendedAt,
          audio: data.audio.base64,
        });
      } else {
        setArrivalMessage({
          sender: data.sender,
          receiver: data.receiver,
          content: data.content,
          sendedAt: data.sendedAt,
        });
      }
    });
  }, []);
  useEffect(() => {
    arrivalMessage &&
      (currentChat?.first == arrivalMessage.sender ||
        currentChat?.second == arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    //socket.current.emit("addUser", idUser);
    socket.on("getUsers", (users) => {
      setUsersConnected(users);
    });
  }, [idUser]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          base_url + "chat/getChatFromUser/" + idUser
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err.Message);
      }
    };
    getConversations();
  }, [idUser]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          base_url +
            "message/getMessagesFromConversation/" +
            currentChat?._id +
            "/" +
            idUser
        );
        setMessages(res.data);
        const result = await getProductById(currentChat?.product);
        setProduct(result);
        setPicture(result.picture[0]);
      } catch (err) {
        console.log(err.Message);
      }

      usersConnected.forEach(function (user) {
        if (user.userId == friendId) {
          socket.emit("seenConversation", {
            user: user.socketId,
            chat: currentChat?._id,
          });
        }
      });
    };

    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    if (newMessage) {
      e.preventDefault();
      const message = {
        sender: idUser,
        content: newMessage,
        chat: currentChat?._id,
        receiver: friendId,
      };

      usersConnected.forEach(function (user) {
        if (user.userId == friendId) {
          socket.emit("sendMessage", {
            sender: idUser,
            receiver: friendId,
            content: newMessage,
            sendedAt: Date.now(),
            like: false,
            removed: false,
            audio: null,
          });
        }
      });

      try {
        const res = await axios.post(base_url + "message/add", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const voiceSubmit = async (e) => {
    if (!voiceOn) {

      
      resetTranscript();
      setNewMessage("");
      setVoiceOn(true);
      SpeechRecognition.startListening({ continuous: true });
    } else {
      setNewMessage(transcript);
      SpeechRecognition.stopListening();

      setVoiceOn(false);
    }
  };

  async function seenConversationOrNot(e) {
    const seenConv = await seenConversation(e._id, idUser);
    return seenConv;
  }

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [friendSocketId, setFriendSocketId] = useState(null);

  useEffect(() => {
    console.log(usersConnected);

    usersConnected?.forEach(function (user) {
      if (user.userId == friendId) {
        setFriendSocketId(user.socketId);
      }
    });
  }, [usersConnected, friendId]);

  const handlePosition = async (e) => {
    if (!onChangeMessage) {
      setOnChangeMessage(true);

      usersConnected.forEach(function (user) {
        if (user.userId == friendId) {
          socket.emit("seenConversation", {
            user: user.socketId,
            chat: currentChat?._id,
          });
        }
      });
    }
  };

  const sendAudio = async (e) => {
    setIsActive(false);
    setCounter(0);
    setSecond("00");
    setMinute("00");
    const response = await fetch(mediaBlobUrl);
    const data = await response.blob();
    const audio = new File([data], "name", {
      type: data.type || "audio/wav",
    });

    // downloadFile(mediaBlobUrl);
    const base64 = await convertFileToBase64(audio);
    if (base64) {
      //e.preventDefault();
      const message = {
        sender: idUser,
        audio: base64,
        chat: currentChat?._id,
        receiver: friendId,
      };

      try {
        const res = await axios.post(base_url + "message/add", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err.message);
      }

      usersConnected.forEach(function (user) {
        if (user.userId == friendId) {
          socket.emit("sendMessage", {
            sender: idUser,
            receiver: friendId,
            content: null,
            sendedAt: Date.now(),
            like: false,
            removed: false,
            audio: base64,
          });
        }
      });
    }
    setVoice(null);
  };

  function voiceCancel() {
    setVoice(null);
  }

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () =>
        resolve({
          fileName: file.title,
          base64: reader.result,
        });
      reader.onerror = reject;
    });

  // check if friend in online or not

  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          {conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)}>
              <Conversation
                conversation={c}
                currentUserId={idUser}
                seenConversation={seenConversationOrNot(c)}
                messages={messages}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="container">
                <div className="row">
                  <div className="col md-4">
                    <div className="row">
                      <div className="col-2">
                        <img
                          className="conversationImg"
                          src={picture}
                          //userFriend.picture
                          alt=""
                        />
                      </div>
                      <div className="col-4">
                        <h2>{product?.name}</h2>
                        <h4>{product?.price} DT</h4>
                      </div>
                    </div>
                  </div>
                  <div className="col md-8"></div>
                </div>
              </div>
              <div className="chatBoxTop">
                {messages.map((m, index) => (
                  <div ref={scrollRef}>
                    <Message
                      message={m}
                      own={m.sender == idUser}
                      last={index == messages.length - 1}
                      usersConnected={usersConnected}
                    />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                {voiceOn ? (
                  <button
                    className="fa fa-microphone voiceSubmitOn"
                    aria-hidden="true"
                    onClick={voiceSubmit}
                  ></button>
                ) : (
                  <button
                    className="fa fa-microphone voiceSubmitOff"
                    aria-hidden="true"
                    onClick={voiceSubmit}
                  ></button>
                )}
                <textarea
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handlePosition(e.target.value);
                  }}
                  value={newMessage}
                ></textarea>
                {voice == false && (
                  <>
                    <button
                      className="c fa fa-microphone voiceSubmitOff"
                      onClick={sendAudio}
                    ></button>

                    <button
                      className="c fa fa-close voiceSubmitOn"
                      onClick={voiceCancel}
                    ></button>
                  </>
                )}

                {voice == null && (
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                )}

                <button
                  className={`${isActive ? "fa fa-pause" : "fa fa-play"}`}
                  style={{
                    padding: "0.8rem 2rem",
                    border: "none",
                    marginLeft: "15px",
                    fontSize: "1rem",
                    cursor: "pointer",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    backgroundColor: "#42b72a",
                    color: "white",
                    transition: "all 300ms ease-in-out",
                    transform: "translateY(0)",
                  }}
                  onClick={() => {
                    if (!isActive) {
                      startRecording();
                      setVoice(true);
                    } else {
                      pauseRecording();
                      stopRecording();
                      setIsActive(!isActive);
                      setVoice(false);
                    }

                    setIsActive(!isActive);
                  }}
                >
                  {/* {isActive ? "Pause" : "Start"} */}
                </button>
              </div>{" "}
            </>
          ) : (
            <span className="noConversationText">
              Open a conversation to start a chat{" "}
            </span>
          )}
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          {currentChat && (
            <>
              <Suspense fallback={<h1>loading details...</h1>}>
                <UserDetails
                  friendId={friendId}
                  currentUserId={idUser}
                  usersConnected={usersConnected}
                  friendSocketId={friendSocketId}
                />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
