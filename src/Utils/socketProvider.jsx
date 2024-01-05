import { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import AuthService from "../Components/Pages/AuthServices/auth.service";
import { SocketContext } from "./socketContext";

const SocketProvider: React.FC = ({ children }) => {
  // we use a ref to store the socket as it won't be updated frequently
  const socket = useRef(socketIOClient(process.env.REACT_APP_URI_IO));

  // When the Provider mounts, initialize it 👆
  // and register a few listeners 👇

  useEffect(() => {
    if (( AuthService.getCurrentUser() )) {
    const id = AuthService.getCurrentUser().id ;
    socket.current.emit("addNotifDelivery", id);
    socket.current.emit("addUser", id);

    socket.current.on("error", (msg: string) => {
      console.error("SocketIO: Error", msg);
    });
  }
    // Remove all the listeners and
    // close the socket when it unmounts
    return () => {
      if (socket && socket.current) {
        socket.current.removeAllListeners();
        socket.current.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
