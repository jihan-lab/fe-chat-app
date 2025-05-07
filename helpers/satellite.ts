import axios from "axios";

const satellite = () => {
  const connection = axios.create({
    // headers,
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  connection.interceptors.request;

  return connection;
};

export default satellite;
