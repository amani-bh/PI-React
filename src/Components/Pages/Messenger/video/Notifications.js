import React, { useContext } from "react";
import { Button } from "@material-ui/core";

import { SocketContext } from "./Context";

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return <div></div>;
};

export default Notifications;
