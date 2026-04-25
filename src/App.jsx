import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";

// temporary admin page (we'll improve later)
function AdminPage() {
  return <h1>Admin Dashboard</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;