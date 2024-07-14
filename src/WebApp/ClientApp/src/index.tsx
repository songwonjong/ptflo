import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
//import App from "./App";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
