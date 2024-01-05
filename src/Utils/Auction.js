import axios from "axios";
import AuthService from "../Components/Pages/AuthServices/auth.service";
import { getProductById } from "./Product";

const url = `${process.env.REACT_APP_URI_IO}/event/`;

export const GetAllActivateAuction = async () => {
  const id_user = AuthService.getCurrentUser().id 

  try {
    const { data } = await axios.get(url + "allevents");
    if (data) {
      for (let i = 0; data.length > i; i++) {
        var result = await getProductById(data[i].product);
        data[i].product = result;
        data[i].Qt = (data[i].listOfParticipants.length / data[i].numberOfParticipants) * 100;
        for (let j = 0; data[i].listOfParticipants.length > j; j++) {
          if (data[i].listOfParticipants[j] === id_user) {
            data[i].CantJoin = true;
            break;
          }
          else{
            data[i].CantJoin = false;

          }
        }
      }
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const GetAllFinishedAuction = async () => {
  try {
    const { data } = await axios.get(url + "allFinished");
    if (data) {
      for (let i = 0; data.length > i; i++) {
        var result = await getProductById(data[i].product);
        data[i].product = result;
      }
    }
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const JoinEvent = async (idUser, idEvent) => {
  try {
    const { data } = await axios.put(
      url + "joinEvent/" + idUser + "/" + idEvent
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const EndEvent = async (idEvent) => {
  try {
    const { data } = await axios.put(
      url + "endEvent/" + idEvent
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAuctionById = async (id) => {
  try {
    const { data } = await axios.get(url + id);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const Bidding = async (idEvent,bid) => {
  try {
    const { data } = await axios.put(url + "addBid/"+idEvent,bid);
    return data;
  } catch (error) {
    
  }
};


export const FindUser = async (id) => {
  try {
    const { data } = await axios.get(`${process.env.REACT_APP_URI_IO}/user/findone/`+id);
    return data;
  } catch (error) {
    
  }
};

