import React, { useContext, useEffect, useState } from "react";
import MapTracker from "./mapTracker";
import { queryServerApi } from "../../../Utils/queryServerApi";
import "./mainTracker.css";
import CSSModules from "react-css-modules";
import SignatureClient from "./SignatureClient";
import { SocketContext } from "../../../Utils/socketContext";
import ReactPaginate from 'react-paginate';
import AuthService from "../AuthServices/auth.service";

function Main() {
  const [data, setData] = useState([]);
  const { socket } = useContext(SocketContext);
  const id = AuthService.getCurrentUser().id ;

  const [finisher, setFinisher] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 2;
  const pagesVisited = pageNumber * usersPerPage;
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  const pageCount = Math.ceil(data?.length / usersPerPage);

  useEffect(async () => {
    const [imp, err] = await queryServerApi("order/get/ByClient/" + id);
    setData(imp.reverse());
    console.log(imp);
  }, []);
  const [saver, setSaver] = useState({});
  useEffect(async () => {
    socket.on("getShippingProd", (data) => {
      console.log ('1')
      setSaver(data.content);
    });
  }, []);

  return (
    data.length !=0 ?
    <>
      <div className="container" style={{ marginTop: "5%" }}>
        {data.slice(pagesVisited, pagesVisited + usersPerPage).map((d, i) => {
          if (d.activation) {
            return (
              <div key={d._id}>
                <section className="rootss bodyss">
                  <figure>
                    <img
                      src="https://www.boots.com/resource/image/1400680/heroteaser_small/600/476/96355775e92f32edb8596432f4ab75bf/Ma/delivery-over-45-blue-hero.jpg"
                      alt=""
                    />
                    <figcaption>
                      <h2 className="h22">ref: # {d._id}</h2>
                      <h6 className="h66">Status : {d.status}</h6>
                      <h6 className="h66">
                        {" "}
                        date :{new Date(d.date).getDay()}/
                        {new Date(d.date).getMonth()}/
                        {new Date(d.date).getFullYear()}{" "}
                      </h6>
                    </figcaption>
                  </figure>

                  {d.status == "in progress" || d.status == "delivered" ? (
                    <section>
                      <div
                        style={{ marginRight: "5%" }}
                        className="row orderstatus-container"
                      >
                        <div className="medium-12 columns order-track ">
                          {[...Array(d.load + 1)].map((k, j) => {
                            return (
                              <div className="orderstatus" key={j}>
                                <div
                                  className={
                                    (saver.order == d._id &&
                                      d.loadTracker + 1 > j) ||
                                    d.loadTracker >j ||
                                    finisher
                                      ? "orderstatus-check-me"
                                      : "orderstatus-check"
                                  }
                                >
                                  <span
                                    className={
                                      (saver.order == d._id &&
                                        d.loadTracker + 1 > j) ||
                                      d.loadTracker > j ||
                                      finisher
                                        ? "orderstatus-number"
                                        : undefined
                                    }
                                  >
                                    {j + 1}
                                  </span>
                                </div>
                                <div className="orderstatus-text">
                                  <time>Step # {j + 1}</time>
                                  {(saver.order == d._id &&
                                    d.loadTracker + 1 > j) ||
                                  d.loadTracker > j ? (
                                    d.loadTracker == j + 1 || finisher ? (
                                      <p>Order delivered</p>
                                    ) : (
                                      <p>Product shipped</p>
                                    )
                                  ) : (
                                    <p>In progress</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <center>
                        {d.status == ("in progress" || "delivered") && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "-25px",
                            }}
                          >
                            {d.status === "in progress" && (
                              <MapTracker data={{ obj: d }} />
                            )}
                            {((saver.order == d._id &&
                              d.loadTracker >= d.load - 1) ||
                              d.loadTracker >= d.load) && (
                              <SignatureClient
                                fin={setFinisher}
                                data={{ obj: d, faller: i }}
                              />
                            )}{" "}
                          </div>
                        )}
                      </center>
                    </section>
                  ) : (
                    <center>
                      <h4 style={{ color: "#5B2A93" }}>
                        this order is not taken yet{" "}
                      </h4>
                    </center>
                  )}
                </section>
                <br />
                <br />
                <br />
                <br />
              </div>
            );
          }
        })}
         <div className="store-filter clearfix">
              <ReactPaginate
              breakLabel="..."
              previousLabel={"<"}
              nextLabel={">"}
              pageCount={pageCount}
              onPageChange={changePage}
              pageRangeDisplayed={5}
              containerClassName={"store-pagination"}
              disabledClassName={"hide"}
              activeClassName={"active"}
              />
            </div>
      </div>
    </>:
<center>
<h1
            style={{
              marginTop: "200px",
              marginBottom: "300px",
              color: "#6E26FF",
            }}
          >
           You don't have any orders for now 
          </h1>
</center>
);
}
export default CSSModules(Main, { allowMultiple: true });
