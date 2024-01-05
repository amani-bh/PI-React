import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import "../DeliverySpace/workingPage/main.css";
import Stepper from "react-stepper-horizontal";
import { Card, Modal } from "reactstrap";
import OrderForm from "../OrderForm/orderForm";
import "../../Components/Pages/order tracker/btnStyles.css";
import PaidForm from "../OrderForm/paidForm";
import "./stepper.css";
import { Link } from "react-router-dom";
export default function StepperPay(props) {
  const [page, setPage] = React.useState(0);
  const [verif, transactionVerif] = useState(true);
  const [stepInfo, setStepInfo] = React.useState({
    steps: [
      { title: "Order details" },
      { title: "Payement details" },
      { title: "Success" },
    ],
  });

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  const { onSubmit } = props;
  const { steps } = stepInfo;

  return (
    <Card
      className="maper pad o"
      style={{
        width: "70%",
        height: "100%",
        marginTop: "2.7%",
        marginBottom: "6em",
        margin: "auto",
        // backgroundColor: "blue",
      }}
    >
      <Stepper
        steps={steps}
        circleFontColor="#FFF"
        defaultColor="lightgray"
        activeColor="lightgray"
        activeStep={page + 1}
        completeColor="#6E26FF"
        completeBarColor="#6E26FF"
      />

      {page === 0 && <OrderForm clickme={nextPage} />}

      {page === 1 && (
        <PaidForm
          setTransaction={transactionVerif}
          back={previousPage}
          next={nextPage}
        />
      )}
      {page === 2 && (
        <>
          {verif ? (
            <center> 
            <div>
              <br />
              <br />
              <h1 style={{ color: "#6e26ff" }}> Transaction success </h1>

              <img
                style={{ height: "20%", width: "25%" }}
                src=" https://us.123rf.com/450wm/faysalfarhan/faysalfarhan1707/faysalfarhan170701832/82007202-%E6%88%90%E5%8A%9F-%E6%A4%9C%E8%A8%BC%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3-%E3%82%AC%E3%83%A9%E3%82%B9%E7%B4%AB%E8%89%B2%E3%81%AE%E5%86%86%E5%BD%A2%E3%83%9C%E3%82%BF%E3%83%B3%E3%81%AE%E6%8A%BD%E8%B1%A1%E7%9A%84%E3%81%AA%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88%E3%81%AB%E5%88%86%E9%9B%A2.jpg"
              />
              <br/>
              <Link to="/shop" style={{ color: "#6e26ff" }}>
                Back to shop
              </Link>
            </div>
            </center>
          ) : (
            <>
              <br />
              <br />
              <center>  
              <h1 style={{ color: "crimson" }}> Transaction refused </h1>
              <h4 style={{ color: "crimson" }}>
                you don't have enough money in your wallet
              </h4>
              <img
                style={{ height: "20%", width: "25%" }}
src="https://media.istockphoto.com/vectors/round-red-x-mark-icon-button-cross-symbol-on-white-background-vector-id1188413565?k=20&m=1188413565&s=170667a&w=0&h=OpmM9AJXj9pqR8SanSJqWDfkN-cbVhKy6e0pEuAguWI="
/>
</center>
            </>
            
          )}
        </>
      )}
    </Card>
  );
}

StepperPay.propTypes = {
  onSubmit: PropTypes.func,
};
