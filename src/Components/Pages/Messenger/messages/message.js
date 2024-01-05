import React, { useContext, useReducer, useState } from "react";
import { useEffect } from "react";

import "./message.css";
import { format } from "timeago.js";
import { removeMessage, likeMessage } from "../../../../Utils/Message";
import { SocketContext } from "../../../../Utils/socketContext";

export default function Message(props) {
  const [removeMess, setRemoveMess] = useState(props.message.removed);
  const [likeMess, setLikeMess] = useState(props.message.like);
  const [seen, setSeen] = useState(props?.message?.seen?.value);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.on("likeMessage", (data) => {
      if (data.messageId == props.message._id) {
        setLikeMess(data.value);
      }
    });

    socket.on("removeMessage", (data) => {
      if (data.messageId == props.message._id) {
        setRemoveMess(true);
      }
    });

    socket.on("seenConversation", (data) => {
      setSeen(true);
    });
  }, []);

  const removeMessageButton = async () => {
    const removeMesageResult = await removeMessage(props.message._id);

    props.usersConnected.forEach(function (user) {
      if (user.userId == props.message.receiver) {
        socket.emit("removeMessage", {
          user: user.socketId,
          messageId: props.message._id,
        });
      }
    });
  };

  const likeMessageButton = async () => {
    const likeMessageResult = await likeMessage(props.message._id);
    props.usersConnected.forEach(function (user) {
      if (user.userId == props.message.sender) {
        socket.emit("likeMessage", {
          user: user.socketId,
          messageId: props.message._id,
          value: likeMessageResult.data,
        });
      }
    });
    //setCart( result);
  };

  return (
    <div className={props.own ? "message own" : "message"}>
      <div className="messageTop">
        
        
        <img
          className="messageImg"
          src="https://gravatar.com/avatar/7a4518c897301242598d09d18e363185?s=400&d=robohash&r=x"
          alt=""
        />

        
        {removeMess ? (
          <p className="messageText">{"Message removed"}</p>
        ) : likeMess ? (
          <div>
             {!props.message.audio ? (
              <p className="messageText">{props.message.content}</p>
            ) : (
              <audio controls="controls" autobuffer="autobuffer">
                <source src={props.message.audio} />{" "}
              </audio>
            )}

            <div className="qty">
              <i class="fas fa-heart" style={{ color: "red" }}></i>
            </div>
          </div>
        ) : (
          <>
            {!props.message.audio ? (
              <p className="messageText">{props.message.content}</p>
            ) : (
              <audio controls="controls" autobuffer="autobuffer">
                <source src={props.message.audio} />{" "}
              </audio>
            )}
          </>
        )}
        ;
        {!removeMess && !props?.own && !likeMess && (
          <div class="menu-nav">
            <div class="dropdown-container " tabindex="-1">
              <div class="three-dots"></div>
              <div class="dropdown likeButton dropMessage">
                <a
                  onClick={() => {
                    likeMessageButton();
                    setLikeMess(true);
                  }}
                >
                  Like
                </a>
              </div>
            </div>
          </div>
        )}
        {!removeMess && !props?.own && likeMess && (
          <div class="menu-nav">
            <div class="dropdown-container" tabindex="-1">
              <div class="three-dots"></div>
              <div class="dropdown likeButton dropMessage ">
                <a
                  onClick={() => {
                    likeMessageButton();
                    setLikeMess(false);
                  }}
                >
                  Unlike
                </a>
              </div>
            </div>
          </div>
        )}
        {!props?.message?.removed && !removeMess && props?.own && (
          <div class="menu-nav">
            <div class="dropdown-container " tabindex="-1">
              <div class="three-dots"></div>
              <div class="dropdown likeButton dropMessage ">
                <a
                  onClick={() => {
                    setRemoveMess(true);
                    removeMessageButton();
                  }}
                >
                  Remove
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="messageBottom">{format(props.message.sendedAt)}</div>
      {props.own && seen && props.last && (
        <div className="seenMessagee">
          Seen {format(props.message.seen.seenAt)}
        </div>
      )}
    </div>
  );
}
