import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./main.css";

const root = document.querySelector("#app-root");
if (root) {
  render(<App />, root);
}

console.log("Hello, world!");
