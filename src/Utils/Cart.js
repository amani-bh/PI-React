import axios from "axios";
const url = `${process.env.REACT_APP_URI_IO}/card/`;

export const getCartById = async (id) => {
  try {
    const { data } = await axios.get(url + "getCardByIdUser/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const addProductToCart = async (idUser, idProduct) => {
  try {
    const { data } = await axios.post(
      url + "addProductToCard/" + idUser + "/" + idProduct
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const RemoveProductFromCard = async (idUser, idProduct) => {
  try {
    const { data } = await axios.put(
      url + "RemoveProductFromCard/" + idUser + "/" + idProduct
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getNbrByIdP = async (id) => {
  try {
    const { data } = await axios.get(url + "getCount/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};
