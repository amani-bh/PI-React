import axios from "axios";


export const getMyExchanges = async (id) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_URI}/exchange/getMyExchanges/` + id);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const getExchangesRequest = async (id) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_URI}/exchange/getExchangesRequest/` + id);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const deleteExchange = async (id) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_URI}/exchange/delete/` + id);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  export const declineExchange = async (id) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_URI}/exchange/decline/` + id);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const updateExchange = async (id,exchange) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_URI}/exchange/update/` + id,exchange);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  export const confirmExchange = async (id) => {
    try {
      const { data } = await axios.put(`${process.env.REACT_APP_URI}/exchange/confirm/` + id);
      
      return data;
    } catch (error) {
      console.log(error);
    }
  };

