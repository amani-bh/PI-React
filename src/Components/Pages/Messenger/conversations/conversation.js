import React, { useEffect, useState } from "react";
import axios from "axios";
import "./conversation.css";
import { getProductById } from "../../../../Utils/Product";
import { getLastMessage, seenConversation } from "../../../../Utils/Message";
import { format } from "timeago.js";

export default function Conversation(props) {
  var friendId = null;
  const [friendUser, setFriendUser] = useState(null);
  const [product, setProduct] = useState();
  const [picture, setPicture] = useState();
  const [lastMessage, setLastMessage] = useState();
  const [seen, setSeen] = useState();

  const base_url = `${process.env.REACT_APP_URI_IO}/`;
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductById(props.conversation.product);
      const resultLastMessage = await getLastMessage(props.conversation._id);
      const resulteenConversation = await seenConversation(
        props.conversation._id,
        props.currentUserId
      );

      props?.seenConversation.then(function (result) {
        setSeen(result);
      });
      setSeen(resulteenConversation);
      setLastMessage(resultLastMessage);

      setProduct(result);
      setPicture(result.picture[0]);
    };
    fetchData();
  }, [props.messages]);

  useEffect(() => {}, [seen]);

  useEffect(() => {
    if (props.currentUserId == props.conversation.first)
      friendId = props.conversation.second;
    else if (props.currentUserId == props.conversation.second)
      friendId = props.conversation.first;
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
  }, [friendId, props.conversation]);

  return (
    <div>
      <div className="conversation">
        <div className="row"></div>

        <div className="col-md-4">
          <img
            className="conversationImg"
            src={picture}
            //userFriend.picture
            alt=""
          />
        </div>
        <div className="col md-8">
          <h3 className="conversationName">
            {friendUser?.lastname?.toUpperCase() +
              " " +
              friendUser?.firstname?.charAt(0)?.toUpperCase() +
              friendUser?.firstname?.slice(1)}
          </h3>

          <h5>{product?.name}</h5>

          <span>{format(lastMessage?.sendedAt)}</span>
          {"-"}

          {lastMessage?.removed ? (
            <>Message removed</>
          ) : (
            <>
              {lastMessage?.content ? (
                <>{lastMessage?.content}</>
              ) : (
                <>Voice message</>
              )}
            </>
          )}

          {!seen && (
            <i className="fas  fa-circle" style={{ color: "#00008B" }}></i>
          )}
        </div>
      </div>
    </div>
  );
}
