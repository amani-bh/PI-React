import React, { useState } from "react";
import Chatbot from "./chatbotMain";
export default function ChatbotCaller() {
  const [act, setAct] = useState(false);
  return (
    <div>
      <a
        style={{ position: "fixed", bottom: "3%", right: 0 }}
        onClick={()=>setAct(!act)}
      >
        <img
        style={{width:'90px',borderRadius:'100%'}}
        src="https://cdn.dribbble.com/users/1953813/screenshots/5350927/chatbot-icon.jpg" />
      </a>
      {act && <Chatbot closer = {setAct}/>}
    </div>
  );
}
