import axios from "axios";

const ServerApi = axios.create({
  baseURL: `${process.env.REACT_APP_URI}`,
});

export default ServerApi;
