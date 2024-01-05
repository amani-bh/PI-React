import axios from "axios";
const url = `${process.env.REACT_APP_URI_IO}/message/`;

export const sendMessage = async (message) => {
  try {
    const data = await axios.post(url + "createChatAndMessage", message);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLastMessage = async (id) => {
  try {
    const { data } = await axios.get(url + "getLastMessage/" + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const likeMessage = async (id) => {
  try {
    const data = await axios.put(url + "likeMessage/" + id);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const removeMessage = async (id) => {
  try {
    const data = await axios.put(url + "removeMessage/" + id);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const seenConversation = async (conversationId,userId) => {
  try {
    const { data } = await axios.get(url + "seenConversation/"+conversationId+"/"+userId );
    return data;
  } catch (error) {
    console.log(error);
  }
};
