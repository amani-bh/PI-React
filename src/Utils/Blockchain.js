import axios from "axios";

const url = `${process.env.REACT_APP_URI_IO}/blockchain/`;

export const GetBalance = async (publicKey) => {
  try {
    const { data } = await axios.get(url + "getBalance/" + publicKey);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const systemMine = async (publicKey, amount) => {
  try {
    const { data } = await axios.post(url + "systemMine", {
      toAddress: publicKey,
      amount: amount,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addTransaction = async (
  privateKey,
  fromAdress,
  toAddress,
  amount
) => {
  try {
    const { data } = await axios.post(url + "addTransaction/" + privateKey, {
      fromAddress: fromAdress,
      toAddress: toAddress,
      amount: amount,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTransactionsForWallet = async (publicKey) => {
  try {
    const { data } = await axios.get(
      url + "getAllTransactionsForWallet/" + publicKey
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTransactions = async () => {
  try {
    const { data } = await axios.get(url + "getAllTransactions");
    return data;
  } catch (error) {
    console.log(error);
  }
};
