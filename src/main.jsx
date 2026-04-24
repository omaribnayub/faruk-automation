import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from "./AdminPage";
import "./index.css";
import { getContent } from "./content/cmsStorage";

const path = window.location.pathname;
const isAdminRoute = path === "/admin";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminPage /> : <App content={getContent()} />}
  </React.StrictMode>
);
