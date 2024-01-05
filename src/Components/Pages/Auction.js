import React, { useContext, useEffect, useState } from "react";
import Moment from "moment";
import {
  GetAllActivateAuction,
  GetAllFinishedAuction,
  JoinEvent,
} from "../../Utils/Auction";
import { Link } from "react-router-dom";
import { SocketContext } from '../../Utils/socketContext';
import AuthService from "./AuthServices/auth.service";


export default function Auction() {
    const { socket } = useContext(SocketContext);
    const [finisheds, setFinisheds] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const id_user = AuthService.getCurrentUser().id ;

    const [condition, setCondition] = useState();
    // var id_user = localStorage.getItem("id");

        useEffect(() => {
        const fetchData = async () => {
            try {

                const resultA = await GetAllActivateAuction();
               console.log(resultA)
                setAuctions(resultA);
                const resultF = await GetAllFinishedAuction();
                setFinisheds(resultF);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
        socket.on("NewEvent", function (data) {
            setCondition(data)
        });
    }, [condition]);

    

    const onSubmit = async (e) => {
        const result = await JoinEvent(id_user, e);
        console.log(id_user,e)
        socket.emit("JoinEvent", result.status);

    };
    return (

        <div className="section">
            <div className="container">
                <div className="row">
                    <div id="aside" className="col-md-3" data-aos="fade-left">
                        <div className="aside">
                            <h3 className="aside-title">AUCTION ENDED</h3>
                            {finisheds?.map((finished) => (
                                <div className="product-widget" key={finished?._id}>
                                    <div className="product-img">
                                        <img src={finished?.product.picture[0]} alt="" />
                                    </div>
                                    <div className="product-body">
                                        <p className="product-category">{Moment(finished?.dateStart).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                        <h3 className="product-name">
                                            <a href="#">{finished?.title}</a>
                                        </h3>
                                        <h4 className="product-price">
                                            ${finished?.finalPrice}.00 <del className="product-old-price">${finished?.product.price}.00</del>
                                        </h4>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div id="store" className="col-md-9">
                        <div className="row">
                            {auctions?.map((auction) => (
                                <div className="col-md-4 col-xs-6" data-aos="fade-in" key={auction._id}>
                                    <div className="product">
                                        <div className="product-img">
                                            <img src={auction?.product.picture[0]} alt="" />
                                        </div>
                                        <div className="product-body">
                                            <h3 className="product-name">
                                                <Link to={"/auction/" + auction?._id}>
                                                    {auction.product.name}
                                                </Link>                                            </h3>
                                            <h3 className="product-name">
                                                Starting price :       ${auction?.startPrice}  <del className="product-old-price"> ${auction.product.price}</del>
                                            </h3>

                                            <h3 className="product-name">Auction room filled at:</h3>
                                            <Progress done={auction?.Qt} />
                                        </div>

                                        <div className="add-to-cart" >
                                            {auction?.CantJoin ? (
                                                <button disabled={true}
                                                    className="Noadd-to-cart-btn"
                                                >{auction.status==="IN_PROGRESS" ?(
                                                    "Go"

                                                ):(
                                                    "already participated"

                                                )}
                                                    
                                                    
                                                    
                                                </button>
                                            ) : (
                                                <button
                                                    className="add-to-cart-btn"
                                                    onClick={() => onSubmit(auction._id)}
                                                >
                                                    <i className="fa fa-shopping-cart"></i> take part in {auction?.costOfParticipation}
                                                </button>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>
                </div>
  );
}

const Progress = ({ done }) => {
  const [style, setStyle] = React.useState({});

  setTimeout(() => {
    const newStyle = {
      opacity: 1,
      width: `${done}%`,
    };
    
  
    setStyle(newStyle);
  }, 1000);

  return (
    <div className="progress">
      <div className="progress-done" style={style}>
        {done}%
      </div>
    </div>
  );
};
