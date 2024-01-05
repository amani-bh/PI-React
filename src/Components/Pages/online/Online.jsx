import { useEffect, useState } from "react";
import { FindUser } from "../../../Utils/Auction";
import "./online.css";

export default function Online({user}) {

  const [useronline, setUseronline] = useState();
  
  useEffect(() => {
    console.log(user)
    const fetchData = async () => {
        try {
          const data = await FindUser(user);
          console.log(data)
          setUseronline(data)
        } catch (error) {
        }
    }
    fetchData();
}, []);
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={useronline?.picture} alt="" />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{useronline?.firstname} {useronline?.lastname}</span>
    </li>
  );
}
