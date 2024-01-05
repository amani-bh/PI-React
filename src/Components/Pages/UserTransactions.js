import React, { useEffect, useState } from "react";
import "./UserTransactions.css";
import { getAllTransactionsForWallet } from "../../Utils/Blockchain";
import { getAllTransactions } from "../../Utils/Blockchain";
import { format } from "timeago.js";

import AuthService from "./AuthServices/auth.service";

export default function UserTransactions() {
  const [myTransactions, setMyTransactions] = useState(null);
  const [UserTransactions, setUserTransactions] = useState(true);
  const [allTransactions, setAllTransactions] = useState(false);
  useEffect(async () => {
    const user = AuthService.getCurrentUser();

    if (UserTransactions)
      setMyTransactions(await getAllTransactionsForWallet(user.publicKey));
    else {
      console.log(await getAllTransactions());
      setMyTransactions(await getAllTransactions());
    }
  }, [UserTransactions, allTransactions]);

  return (
    <body>
      <div className="row positionCenterH1">
        <div className="dash-elements col-md-2">
          <a
            className="primary-btn "
            onClick={() => {
              setUserTransactions(true);
              setAllTransactions(false);
            }}
          >
            My transactions
          </a>
        </div>

        <div className="dash-elements col-md-2">
          <a
            className="primary-btn "
            onClick={() => {
              setAllTransactions(true);
              setUserTransactions(false);
            }}
          >
            All transactions
          </a>
        </div>
      </div>

      <div style={{ margin: "2%" }}></div>
      {UserTransactions ? (
        <h1>All your transactions</h1>
      ) : (
        <h1>All transactions</h1>
      )}
      <div>
        <div className="positionCenterLogo">
          <a className="logo">
            <img src="./img/techcoins.png" alt="" />
          </a>
        </div>
      </div>
      <table class="table">
        <tr>
          <th class="table__heading">Hash</th>
          <th class="table__heading">Time</th>
          <th class="table__heading">Amount (TTC)</th>
          <th class="table__heading">Amount (USD)</th>
        </tr>
        {myTransactions?.map((transaction) => (
          <tr class="table__row">
            <td class="table__content" data-heading="Player">
              {transaction?.hash}
            </td>
            <td class="table__content" data-heading="Seasons">
              {format(transaction?.transaction?.timestamp)}
            </td>
            <td class="table__content" data-heading="Points">
              {transaction?.transaction?.amount}
            </td>
            <td class="table__content" data-heading="Jersey Number">
              {(transaction?.transaction?.amount / 3.12).toPrecision(4)}
            </td>
          </tr>
        ))}
      </table>

      <div style={{ margin: "10%" }}></div>
    </body>
  );
}
