import React, { cloneElement } from "react";
import "./cooler.css";
import { motion } from "framer-motion";
export default function usingCharts() {
  return (
    <div className="feat bg-gray pt-5 pb-5">
      <div className="container">
        <div className="row">
          <div className="section-head col-sm-12">
            <h4>
              <span>Ready to</span> Ride?
            </h4>
            <p></p>
          </div>

          <center>
            <div className="col-sm-12 col-md-6">
              <motion.div className="item" whileHover={{ scale: 1.02 }}>
                <span className="icon feature_box_col_one ">
                  <i className="fa-solid fa-1"></i>
                </span>
                <h6>Choose an Order </h6>
                <p style={{ color: "black" }}>
                  you can choose the orders you want to work on
                </p>
              </motion.div>
            </div>

            <motion.div
              className="col-sm-12 col-md-6"
              whileHover={{ scale: 1.06 }}
            >
              <motion.div className="item" whileHover={{ scale: 1.02 }}>
                <span className="icon feature_box_col_two">
                  <i className="fa-solid fa-2"></i>
                </span>
                <h6>Sign for products</h6>
                <p style={{ color: "black" }}>
                  You only need to sign when you get the product after that the
                  product is under your responsability
                </p>
              </motion.div>
            </motion.div>

            <div className="col-sm-12 col-md-6">
              <motion.div className="item" whileHover={{ scale: 1.02 }}>
                <span className="icon feature_box_col_three">
                  <i className="fa-solid fa-3"></i>
                </span>
                <h6>Weekly game</h6>
                <p style={{ color: "black" }}>
                  As we want to motivate our workers we offer to you each a tour
                  in wheel of fortune
                </p>
              </motion.div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}
