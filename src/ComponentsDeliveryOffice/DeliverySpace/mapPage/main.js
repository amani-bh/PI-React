import React from "react";
import Header from "../static/header";
import Map from "./mainMap";
import Footer from "../static/footer";
import { motion } from "framer-motion";
import "./styles.css";
import Chart from "./usingCharts";
export default function Main() {
  return (
    <div style={{ overflowX: "hidden", backgroundColor: "rgba(0,10,10,0.05)" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <motion.div
        className="section-head col-sm-12"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 3 }}
      >
        <h4>
          <span>Pick your</span> Orders
        </h4>
        <p></p>
      </motion.div>
      <Map />

      <Chart />
      <br />
      <br />
    </div>
  );
}
