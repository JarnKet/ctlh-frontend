import React from "react";
import "moment/locale/lo";
import Routes from "./Routes";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import { InMemoryCache, ApolloProvider, ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { USER_KEY } from "./consts";

const httpLink = createHttpLink({
  // uri: 'https://spz10ekeq0.execute-api.ap-southeast-1.amazonaws.com/',
  uri: "http://localhost:6060",
  // uri: 'http://192.168.0.21:6060',
  //   uri: "https://medical-api.selectoptions.net:6060/",
});

const authLink = setContext((_, { headers }) => {
  const localData = localStorage.getItem(USER_KEY);
  let decodeData = JSON.parse(localData);
  return {
    headers: {
      ...headers,
      authorization: decodeData ? decodeData["accessToken"] : "",
    },
  };
});
export default function App() {
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <Routes />
      <ToastContainer autoClose={2000} theme="colored" />
    </ApolloProvider>
  );
}
