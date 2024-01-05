import axios from "axios";
const url = `${process.env.REACT_APP_URI_IO}/chat/`;

export const findUserById = async (friendId) => {
  try {
    const { data } = await axios.get(url + "findUserById?id=" + friendId);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const chatExist = async (chat) => {
  try {
    const { data } = await axios.put(url + "chatExist", chat);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getChats = async (idUser) => {
  try {
    const { data } = await axios.get(url +"getChatFromUser/" + idUser);
    return data;
  } catch (error) {
    console.log(error);
  }
};
