import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";
import { JoinContextProvider } from "./contexts/join-context/JoinContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <JoinContextProvider>
      <App />
    </JoinContextProvider>
  </React.StrictMode>
);
