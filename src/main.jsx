import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AdminPage from "./AdminPage";
import "./index.css";
import { defaultContent } from "./content/defaultContent";
import { getSiteContent } from "./content/cmsService";

const path = window.location.pathname;
const isAdminRoute = path === "/admin";

function SiteRoot() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    getSiteContent()
      .then((data) => setContent(data))
      .catch(() => setContent(defaultContent));
  }, []);

  return <App content={content} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminPage /> : <SiteRoot />}
  </React.StrictMode>
);
